import http from "node:http";
import https from "node:https";
import net from "node:net";

import { setGlobalDispatcher, type Dispatcher } from "undici";

import logger from "../logger/logger.js";
import { Retry } from "../utils/Retry.js";
import { ErrorFactory, ErrorFormatter } from "../errors/index.js";

import { loadProxyConfig, type ProxyConfig } from "./ProxyConfig.js";
import { ProxyAgentFactory } from "./ProxyAgentFactory.js";
import { GlobalAgentBootstrapper } from "./GlobalAgentBootstrapper.js";

export class ProxyManager {
    private readonly config: ProxyConfig;

    private readonly globalAgentBootstrapper = new GlobalAgentBootstrapper();

    private dispatcher: Dispatcher | undefined;

    private healthy = true;

    private healthCheckTimer: NodeJS.Timeout | undefined;

    private originalHttpAgent: http.Agent | undefined;

    private originalHttpsAgent: https.Agent | undefined;

    constructor() {
        this.config = loadProxyConfig();
    }

    public isEnabled(): boolean {
        return this.config.enabled;
    }

    public getRestAgent(): Dispatcher | undefined {
        return this.dispatcher;
    }

    public async initialize(): Promise<void> {
        if (!this.config.enabled) {
            logger.info("Proxy", "Proxy is disabled. Connecting to Discord directly.");

            return;
        }

        logger.info("Proxy", `Proxy enabled (${this.config.type}). Preparing connection...`);

        await Retry.run(
            async () => {
                await this.checkProxyReachable();

                const agents = ProxyAgentFactory.create(this.config);

                this.dispatcher = agents.dispatcher;

                setGlobalDispatcher(agents.dispatcher);

                if (agents.coreAgents) {
                    // SOCKS5 path: best-effort core agent override for the Gateway.
                    this.originalHttpAgent = http.globalAgent;
                    this.originalHttpsAgent = https.globalAgent;

                    http.globalAgent = agents.coreAgents.httpAgent;
                    https.globalAgent = agents.coreAgents.httpsAgent;

                    logger.warn(
                        "Proxy",
                        "SOCKS5 Gateway routing relies on a best-effort core agent " +
                            "override, unlike the verified HTTP/HTTPS path. Confirm the " +
                            "bot reaches 'Ready' — if it does not, route the Gateway " +
                            "through a local HTTP bridge in front of the SOCKS5 proxy."
                    );
                } else {
                    // HTTP/HTTPS path: verified approach recommended by the official
                    // discord.js proxy guide for the Gateway handshake.
                    this.globalAgentBootstrapper.install(this.config);
                }

                logger.info("Proxy", "Proxy connection established successfully.");
            },
            {
                retries: Infinity,
                delay: this.config.retry.delay,
                factor: this.config.retry.factor,
                maxDelay: this.config.retry.maxDelay,
            }
        );

        this.startHealthCheck();
    }

    public shutdown(): void {
        if (this.healthCheckTimer) {
            clearInterval(this.healthCheckTimer);

            this.healthCheckTimer = undefined;
        }

        if (this.originalHttpAgent) {
            http.globalAgent = this.originalHttpAgent;
        }

        if (this.originalHttpsAgent) {
            https.globalAgent = this.originalHttpsAgent;
        }

        // Note: if the HTTP/HTTPS path was used, `global-agent`'s patch to
        // `http.request` / `https.request` has no official uninstall and remains
        // active for the remaining lifetime of the process. This only matters for
        // processes that disable the proxy and expect direct connectivity afterward
        // without restarting — which this application does not currently do, since
        // proxy configuration is read once at startup.
    }

    private startHealthCheck(): void {
        this.healthCheckTimer = setInterval(() => {
            void this.checkHealth();
        }, this.config.healthCheckIntervalMs);

        this.healthCheckTimer.unref?.();
    }

    private async checkHealth(): Promise<void> {
        try {
            await this.checkProxyReachable();

            if (!this.healthy) {
                this.healthy = true;

                logger.info("Proxy", "Proxy connectivity recovered.");
            }
        } catch (error) {
            if (this.healthy) {
                this.healthy = false;

                const frameworkError = ErrorFactory.create(error);

                logger.warn("Proxy", ErrorFormatter.format(frameworkError));
                logger.warn("Proxy", "Proxy connectivity lost. Monitoring will continue.");
            }
        }
    }

    private async checkProxyReachable(): Promise<void> {
        const target = new URL(this.config.url);

        const port = Number(target.port || (this.config.type === "http" ? 80 : 443));

        await new Promise<void>((resolve, reject) => {
            const socket = net.createConnection(
                {
                    host: target.hostname,
                    port,
                    timeout: this.config.connectTimeoutMs,
                },
                () => {
                    socket.destroy();

                    resolve();
                }
            );

            socket.once("timeout", () => {
                socket.destroy();

                reject(new Error(`Timed out connecting to proxy at ${target.hostname}:${port}`));
            });

            socket.once("error", (error) => {
                reject(error);
            });
        });
    }
}

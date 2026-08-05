import tls from "node:tls";
import type { Agent as HttpAgent } from "node:http";
import type { Agent as HttpsAgent } from "node:https";

import { Agent, ProxyAgent, type Dispatcher } from "undici";
import { SocksProxyAgent } from "socks-proxy-agent";
import { SocksClient } from "socks";

import logger from "../logger/logger.js";
import { ProxyError } from "../errors/index.js";

import type { ProxyConfig } from "./ProxyConfig.js";

export interface CoreAgents {
    httpAgent: HttpAgent;
    httpsAgent: HttpsAgent;
}

export interface ProxyAgents {
    /** Used as `rest.agent` for @discordjs/rest and as the global undici dispatcher. */
    dispatcher: Dispatcher;

    /**
     * Node core agents used to override `http.globalAgent` / `https.globalAgent`.
     * Only populated for `socks5`. For `http`/`https`, Gateway traffic is instead
     * routed through `GlobalAgentBootstrapper`, which patches at the request-function
     * level rather than the default-agent level. See `ProxyManager` for details.
     */
    coreAgents?: CoreAgents;
}

interface SocksTarget {
    host: string;
    port: number;
    userId?: string;
    password?: string;
}

function parseSocksTarget(url: string): SocksTarget {
    const parsed = new URL(url);

    const target: SocksTarget = {
        host: parsed.hostname,
        port: Number(parsed.port || "1080"),
    };

    if (parsed.username) {
        target.userId = decodeURIComponent(parsed.username);
    }

    if (parsed.password) {
        target.password = decodeURIComponent(parsed.password);
    }

    return target;
}

/**
 * Builds a custom undici Dispatcher that tunnels every connection through a SOCKS5 proxy.
 *
 * NOTE: undici's low-level `connect` hook used here is not part of its stable public API
 * surface and its option shape (`hostname`/`port`/`protocol`) should be re-verified whenever
 * the `undici` dependency version changes.
 */
function createSocksDispatcher(config: ProxyConfig): Dispatcher {
    const proxy = parseSocksTarget(config.url);

    return new Agent({
        connect: (options, callback) => {
            const rawDestination = options as unknown as {
                hostname?: string;
                host?: string;
                port: number | string;
                protocol?: string;
            };

            const destinationHost = rawDestination.hostname ?? rawDestination.host;

            const destinationPort = Number(
                rawDestination.port || (rawDestination.protocol === "https:" ? 443 : 80)
            );

            if (!destinationHost || !Number.isFinite(destinationPort) || destinationPort <= 0) {
                logger.error(
                    "Proxy",
                    `SOCKS5 connector received an invalid destination: ${JSON.stringify(
                        rawDestination
                    )}`
                );

                callback(
                    new Error("SOCKS5 connector received an invalid destination host/port."),
                    null
                );

                return;
            }

            SocksClient.createConnection({
                proxy: {
                    host: proxy.host,
                    port: proxy.port,
                    type: 5,
                    ...(proxy.userId !== undefined ? { userId: proxy.userId } : {}),
                    ...(proxy.password !== undefined ? { password: proxy.password } : {}),
                },
                command: "connect",
                destination: {
                    host: destinationHost,
                    port: destinationPort,
                },
                timeout: config.connectTimeoutMs,
            })
                .then(({ socket }) => {
                    if (rawDestination.protocol === "https:") {
                        const tlsSocket = tls.connect({
                            socket,
                            servername: destinationHost,
                        });

                        tlsSocket.once("secureConnect", () => callback(null, tlsSocket));

                        tlsSocket.once("error", (error) => callback(error, null));

                        return;
                    }

                    callback(null, socket);
                })
                .catch((error: unknown) => {
                    logger.error(
                        "Proxy",
                        `SOCKS5 connection to ${destinationHost}:${destinationPort} failed: ${
                            error instanceof Error ? error.message : String(error)
                        }`
                    );

                    callback(error instanceof Error ? error : new Error(String(error)), null);
                });
        },
    });
}

export class ProxyAgentFactory {
    public static create(config: ProxyConfig): ProxyAgents {
        switch (config.type) {
            case "http":
            case "https":
                return {
                    dispatcher: new ProxyAgent(config.url),
                };

            case "socks5": {
                const socksAgent = new SocksProxyAgent(config.url);

                return {
                    dispatcher: createSocksDispatcher(config),
                    coreAgents: {
                        httpAgent: socksAgent as unknown as HttpAgent,
                        httpsAgent: socksAgent as unknown as HttpsAgent,
                    },
                };
            }

            default: {
                const exhaustive: never = config.type;

                throw new ProxyError(`Unsupported proxy type '${String(exhaustive)}'.`);
            }
        }
    }
}

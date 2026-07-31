import { ServiceTokens } from "../container/index.js";
import { container } from "../container/index.js";

import { loadCommands } from "../handlers/commandHandler.js";
import { loadEvents } from "../handlers/eventHandler.js";

import { validateConfig } from "../config/config.js";

import logger from "../logger/logger.js";

import { ClientManager } from "./ClientManager.js";

import { monitoring } from "../monitoring/index.js";

import { ProxyManager } from "../proxy/ProxyManager.js";
import { RestKeepAlive } from "../proxy/RestKeepAlive.js";

export class Bootstrap {
    private readonly proxyManager: ProxyManager;

    private clientManager!: ClientManager;

    private restKeepAlive: RestKeepAlive | undefined;

    constructor() {
        this.proxyManager = new ProxyManager();
    }

    public async initialize(): Promise<void> {
        logger.info("Bootstrap", "Initializing framework");

        validateConfig();

        logger.info("Bootstrap", "Preparing proxy layer");

        await this.proxyManager.initialize();

        this.clientManager = new ClientManager(this.proxyManager.getRestAgent());

        container.register(ServiceTokens.Logger, () => logger);

        container.register(ServiceTokens.Client, () => this.clientManager.getClient());

        container.register(ServiceTokens.ClientManager, () => this.clientManager);

        container.register(ServiceTokens.ProxyManager, () => this.proxyManager);

        logger.info("Bootstrap", "Loading commands");

        await loadCommands();

        logger.info("Bootstrap", "Loading events");

        await loadEvents(this.clientManager.getClient());

        await this.clientManager.login();

        if (this.proxyManager.isEnabled()) {
            this.restKeepAlive = new RestKeepAlive(
                this.clientManager.getClient(),
                this.proxyManager.getConfig().restKeepAliveIntervalMs
            );

            this.restKeepAlive.start();
        }

        monitoring.initialize(this.clientManager.getClient());

        monitoring.start();

        logger.info("Bootstrap", "Monitoring started");

        logger.info("Bootstrap", "Framework started");
    }

    public async shutdown(): Promise<void> {
        logger.info("Bootstrap", "Shutting down framework");

        monitoring.stop();

        logger.info("Bootstrap", "Monitoring stopped");

        this.restKeepAlive?.stop();

        await this.clientManager.destroy();

        this.proxyManager.shutdown();

        logger.info("Bootstrap", "Framework stopped");
    }
}

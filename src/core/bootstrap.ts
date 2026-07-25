import { ServiceTokens } from "../container/index.js";
import { container } from "../container/index.js";

import { loadCommands } from "../handlers/commandHandler.js";
import { loadEvents } from "../handlers/eventHandler.js";

import { validateConfig } from "../config/config.js";

import logger from "../logger/logger.js";

import { ClientManager } from "./ClientManager.js";

import { monitoring } from "../monitoring/index.js";

export class Bootstrap {
    private readonly clientManager: ClientManager;

    constructor() {
        this.clientManager = new ClientManager();
    }

    public async initialize(): Promise<void> {
        logger.info("Bootstrap", "Initializing framework");

        validateConfig();

        container.register(ServiceTokens.Logger, () => logger);

        container.register(ServiceTokens.Client, () => this.clientManager.getClient());

        container.register(ServiceTokens.ClientManager, () => this.clientManager);

        logger.info("Bootstrap", "Loading commands");

        await loadCommands();

        logger.info("Bootstrap", "Loading events");

        await loadEvents(this.clientManager.getClient());

        await this.clientManager.login();

        monitoring.initialize(this.clientManager.getClient());

        monitoring.start();

        logger.info("Bootstrap", "Monitoring started");

        logger.info("Bootstrap", "Framework started");
    }

    public async shutdown(): Promise<void> {
        logger.info("Bootstrap", "Shutting down framework");

        monitoring.stop();

        logger.info("Bootstrap", "Monitoring stopped");

        await this.clientManager.destroy();

        logger.info("Bootstrap", "Framework stopped");
    }
}

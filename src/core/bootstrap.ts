import { loadCommands } from "../handlers/commandHandler.js";
import { loadEvents } from "../handlers/eventHandler.js";
import { validateConfig } from "../config/config.js";
import logger from "../logger/logger.js";
import { ClientManager } from "./ClientManager.js";

export class Bootstrap {
    private readonly clientManager: ClientManager;

    constructor() {
        this.clientManager = new ClientManager();
    }

    public async initialize(): Promise<void> {
        logger.info("Initializing framework");

        validateConfig();

        logger.info("Loading commands");
        await loadCommands();

        logger.info("Loading events");
        await loadEvents(this.clientManager.getClient());

        await this.clientManager.login();

        logger.info("Framework started");
    }

    public async shutdown(): Promise<void> {
        logger.info("Shutting down framework");

        await this.clientManager.destroy();

        logger.info("Framework stopped");
    }
}
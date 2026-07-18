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
        logger.info("Bootstrap", "Initializing framework");

        validateConfig();

        logger.info("Bootstrap", "Loading commands");
        await loadCommands();

        logger.info("Bootstrap", "Loading events");
        await loadEvents(this.clientManager.getClient());

        await this.clientManager.login();

        logger.info("Bootstrap", "Framework started");

    }

    public async shutdown(): Promise<void> {
        logger.info("Bootstrap", "Shutting down framework");


        await this.clientManager.destroy();

        logger.info("Bootstrap", "Framework stopped");
    }
}
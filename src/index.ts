import { Client, GatewayIntentBits } from "discord.js";

import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { config, validateConfig } from "./config/config.js";
import logger from "./logger/logger.js";

validateConfig();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});

process.on("unhandledRejection", (error) => {
    logger.error("Unhandled Promise Rejection", error);
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception", error);
});

client.on("error", (error) => {
    logger.error("Discord Client Error", error);
});

client.on("shardDisconnect", (event, shardId) => {
    logger.warn(`Shard ${shardId} disconnected (${event.code})`);
});

client.on("shardReconnecting", (shardId) => {
    logger.info(`Shard ${shardId} reconnecting`);
});

client.on("shardReady", (shardId) => {
    logger.info(`Shard ${shardId} ready`);
});

async function start() {
    try {
        logger.info("Loading commands");
        await loadCommands();

        logger.info("Loading events");
        await loadEvents(client);

        logger.info("Connecting to Discord");
        await client.login(config.token);

        logger.info("Bot is online");
        logger.info("Logger INFO works.");
        logger.warn("Logger WARN works.");
        logger.error("Logger ERROR works.");
        logger.debug("Logger DEBUG works.");
    } catch (error) {
        logger.error("Startup failed", error);
        process.exit(1);
    }
}

start();
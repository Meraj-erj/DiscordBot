import process from "node:process";

import type { Event } from "../interfaces/Event.js";
import logger from "../logger/logger.js";
import { config } from "../config/config.js";

const event: Event = {
    name: "clientReady",
    once: true,

    async execute(client) {
        logger.info("============================================================");
        logger.info("Discord Bot");
        logger.info("============================================================");
        logger.info(`Bot         : ${client.user.tag}`);
        logger.info(`Bot ID      : ${client.user.id}`);
        logger.info(`Guilds      : ${client.guilds.cache.size}`);
        logger.info(`Node.js     : ${process.version}`);
        logger.info(`Environment : ${config.environment}`);
        logger.info("============================================================");
    },
};

export default event;
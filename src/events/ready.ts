import process from "node:process";

import type { Event } from "../interfaces/Event.js";
import logger from "../logger/logger.js";
import { config } from "../config/config.js";

const event: Event = {
    name: "clientReady",
    once: true,

    async execute(client) {
        logger.info("Ready","============================================================");
        logger.info("Ready","Discord Bot");
        logger.info("Ready","============================================================");
        logger.info("Ready",`Bot         : ${client.user.tag}`);
        logger.info("Ready",`Bot ID      : ${client.user.id}`);
        logger.info("Ready",`Guilds      : ${client.guilds.cache.size}`);
        logger.info("Ready",`Node.js     : ${process.version}`);
        logger.info("Ready",`Environment : ${config.environment}`);
        logger.info("Ready","============================================================");
    },
};

export default event;
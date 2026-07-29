import * as dotenv from "dotenv";

import logger from "./logger/logger.js";
import { loadCommands } from "./handlers/commandHandler.js";
import { deployCommands } from "./handlers/deployCommands.js";
import { Retry } from "./utils/Retry.js";

dotenv.config();

async function main(): Promise<void> {
    logger.info("Deploy", "Loading commands...");

    await loadCommands();

    logger.info("Deploy", "Deploying commands...");

    await Retry.run(
        async () => {
            await deployCommands();
        },
        {
            retries: 5,
            delay: 5000,
        }
    );

    logger.info("Deploy", "Deploy completed successfully!");
}

main().catch((error) => {
    logger.error("Deploy", "Deploy failed permanently.");

    if (error instanceof Error) {
        logger.error("Deploy", error.message);
    }

    process.exit(1);
});

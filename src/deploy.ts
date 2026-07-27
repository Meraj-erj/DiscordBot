import * as dotenv from "dotenv";

import logger from "./logger/logger.js";

import { loadCommands } from "./handlers/commandHandler.js";
import { deployCommands } from "./handlers/deployCommands.js";

dotenv.config();

async function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runWithRetry(
    task: () => Promise<void>,
    retries = 5,
    delayTime = 5000
): Promise<void> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`🔄 Attempt ${attempt}/${retries}`);

            await task();

            return;
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed`);

            if (attempt === retries) {
                throw error;
            }

            console.log(`⏳ Retrying in ${delayTime / 1000}s...`);

            await delay(delayTime);
        }
    }
}

async function main(): Promise<void> {
    logger.info("Deploy", "Loading commands...");

    await loadCommands();

    console.log("🚀 Deploying commands...");

    await runWithRetry(
        async () => {
            await deployCommands();
        },
        5,
        5000
    );

    console.log("🎉 Deploy completed successfully!");
}

main().catch((error) => {
    logger.error("Deploy", "Deploy failed permanently:");

    console.error(error);

    process.exit(1);
});

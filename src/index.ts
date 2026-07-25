import { ErrorFactory } from "./errors/ErrorFactory.js";
import { ErrorFormatter } from "./errors/ErrorFormatter.js";

import { Application } from "./core/Application.js";
import logger from "./logger/logger.js";

const app = new Application();

async function main() {
    try {
        await app.start();
    } catch (error) {
        const frameworkError = ErrorFactory.create(error);

        logger.error("Application", ErrorFormatter.format(frameworkError));

        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    logger.info("Process", "SIGINT received");

    await app.shutdown();

    process.exit(0);
});

process.on("SIGTERM", async () => {
    logger.info("Process", "SIGTERM received");

    await app.shutdown();

    process.exit(0);
});

main();

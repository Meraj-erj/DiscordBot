import { Application } from "./core/Application.js";
import logger from "./logger/logger.js";


const app = new Application();


async function main() {
    try {
        await app.start();
    } catch (error) {
        logger.error("Application startup failed", error);
        process.exit(1);
    }
}


process.on("SIGINT", async () => {
    logger.info("SIGINT received");

    await app.shutdown();

    process.exit(0);
});


process.on("SIGTERM", async () => {
    logger.info("SIGTERM received");

    await app.shutdown();

    process.exit(0);
});


main();
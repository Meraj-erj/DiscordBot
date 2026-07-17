import * as dotenv from "dotenv";

import { loadCommands } from "./handlers/commandHandler.js";
import { deployCommands } from "./handlers/deployCommands.js";

dotenv.config();

async function main() {
    console.log("📦 Loading commands...");

    await loadCommands();

    console.log("🚀 Deploying commands...");

    await deployCommands();

    console.log("🎉 Deploy completed successfully!");
}

main().catch(console.error);
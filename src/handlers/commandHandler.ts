import { CommandValidator } from "../validators/index.js";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { commands } from "../collections/commands.js";
import logger from "../logger/logger.js";

export async function loadCommands(): Promise<void> {
    const commandsPath = path.join(process.cwd(), "src", "commands");

    const files = await readdir(commandsPath);

    for (const file of files) {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) {
            continue;
        }

        const filePath = path.join(commandsPath, file);

        const module = await import(pathToFileURL(filePath).href);

        const command = module.default;

        CommandValidator.validate(command, filePath);

        commands.set(command.data.name, command);

        logger.info("CommandHandler", `Loaded command: ${command.data.name}`);
    }

    logger.info("CommandHandler", `Loaded ${commands.size} command(s).`);
}

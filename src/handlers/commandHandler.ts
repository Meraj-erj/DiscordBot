import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { commands } from "../collections/commands.js";
import type { Command } from "../interfaces/Command.js";


export async function loadCommands() {
    const commandsPath = path.join(
        process.cwd(),
        "src",
        "commands"
    );

    const files = await readdir(commandsPath);


    for (const file of files) {

        if (!file.endsWith(".ts") && !file.endsWith(".js")) {
            continue;
        }


        const filePath = path.join(
            commandsPath,
            file
        );


        const module = await import(
            pathToFileURL(filePath).href
        );


        const command: Command = module.default;


        commands.set(
            command.data.name,
            command
        );


        console.log(
            `✅ Loaded command: ${command.data.name}`
        );
    }
}
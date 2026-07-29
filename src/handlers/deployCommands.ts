import { REST, Routes } from "discord.js";

import { commands } from "../collections/commands.js";
import logger from "../logger/logger.js";

export async function deployCommands(): Promise<void> {
    const rest = new REST({
        version: "10",
    }).setToken(process.env.DISCORD_TOKEN!);

    try {
        logger.debug("Deploy", `CLIENT_ID: ${process.env.CLIENT_ID}`);
        logger.debug("Deploy", `GUILD_ID: ${process.env.GUILD_ID}`);

        logger.debug(
            "Deploy",
            `Commands: ${Array.from(commands.values())
                .map((command) => command.data.name)
                .join(", ")}`
        );

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
            {
                body: Array.from(commands.values()).map((command) => command.data.toJSON()),
            }
        );

        logger.info("Deploy", `${commands.size} command(s) deployed.`);
    } catch (error) {
        logger.error("Deploy", "Deploy failed.");

        if (error instanceof Error) {
            logger.error("Deploy", error.message);
        }

        throw error;
    }
}

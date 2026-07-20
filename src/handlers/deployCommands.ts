import { REST, Routes } from "discord.js";
import { commands } from "../collections/commands.js";

export async function deployCommands(): Promise<void> {

    const rest = new REST({
        version: "10"
    }).setToken(
        process.env.DISCORD_TOKEN!
    );


    try {

        console.log(
            "CLIENT_ID:",
            process.env.CLIENT_ID
        );

        console.log(
            "GUILD_ID:",
            process.env.GUILD_ID
        );

        console.log(
            "Commands:",
            commands.map(c => c.data.name)
        );


        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID!,
                process.env.GUILD_ID!
            ),
            {
                body: commands.map(
                    command => command.data.toJSON()
                ),
            }
        );


        console.log(
            `✅ ${commands.size} command(s) deployed.`
        );


    } catch (error) {

        console.error(
            "❌ Deploy failed:"
        );

        console.error(error);


        // مهم برای Retry
        throw error;

    }

}
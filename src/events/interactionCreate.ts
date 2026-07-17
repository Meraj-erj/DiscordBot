import type { Event } from "../interfaces/Event.js";
import { commands } from "../collections/commands.js";

const event: Event = {
    name: "interactionCreate",

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "❌ An error occurred.",
                });
            } else {
                await interaction.reply({
                    content: "❌ An error occurred.",
                    ephemeral: true,
                });
            }
        }
    },
};

export default event;
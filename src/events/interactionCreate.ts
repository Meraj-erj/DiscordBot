import { ChatInputCommandInteraction, MessageFlags } from "discord.js";

import type { Event } from "../interfaces/Event.js";
import { commands } from "../collections/commands.js";
import logger from "../logger/logger.js";

const event: Event = {
    name: "interactionCreate",

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            if (error instanceof Error) {
                logger.error("Interaction", error.message);
            }

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: "❌ An error occurred.",
                    });
                } else {
                    await interaction.reply({
                        content: "❌ An error occurred.",
                        flags: MessageFlags.Ephemeral,
                    });
                }
            } catch (replyError) {
                if (replyError instanceof Error) {
                    logger.error(
                        "Interaction",
                        `Failed to notify user of error: ${replyError.message}`
                    );
                }
            }
        }
    },
};

export default event;

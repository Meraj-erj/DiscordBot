import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../interfaces/Command.js";

const command: Command = {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),

    async execute(interaction) {
        await interaction.deferReply();

        await interaction.editReply("🏓 Pong!");
    },
};

export default command;

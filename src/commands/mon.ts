import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

import { requireMonitorRole } from "../utils/permissions.js";

import type { Command } from "../interfaces/Command.js";

import { basicHandler } from "../monitoring/handlers/basic.js";
import { fullHandler } from "../monitoring/handlers/full.js";
import { debugHandler } from "../monitoring/handlers/debug.js";

const command: Command = {
    data: new SlashCommandBuilder()

        .setName("mon")

        .setDescription("Monitoring")

        .addSubcommand((sub) =>
            sub

                .setName("basic")

                .setDescription("Basic monitoring")
        )

        .addSubcommand((sub) =>
            sub

                .setName("full")

                .setDescription("Full monitoring")
        )

        .addSubcommand((sub) =>
            sub

                .setName("debug")

                .setDescription("Debug monitoring")
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        if (!(await requireMonitorRole(interaction))) {
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case "basic":
                await basicHandler(interaction);
                return;

            case "full":
                await fullHandler(interaction);
                return;

            case "debug":
                await debugHandler(interaction);
                return;
        }
    },
};

export default command;

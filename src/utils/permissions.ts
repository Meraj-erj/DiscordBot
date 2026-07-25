import { ChatInputCommandInteraction, GuildMember } from "discord.js";

import { config } from "../config/index.js";

export async function requireMonitorRole(
    interaction: ChatInputCommandInteraction
): Promise<boolean> {
    if (!interaction.inGuild()) {
        await interaction.reply({
            content: "❌ This command can only be used in a server.",
            ephemeral: true,
        });

        return false;
    }

    const member = interaction.member as GuildMember;

    if (!member.roles.cache.has(config.monitorRoleId)) {
        await interaction.reply({
            content: "❌ You don't have permission to use this command.",
            ephemeral: true,
        });

        return false;
    }

    return true;
}

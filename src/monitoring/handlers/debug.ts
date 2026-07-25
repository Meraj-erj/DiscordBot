import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export async function debugHandler(interaction: ChatInputCommandInteraction) {
    const mem = process.memoryUsage();

    const embed = new EmbedBuilder()

        .setColor("#ef4444")

        .setAuthor({
            name: "Mary • Debug",

            iconURL: interaction.client.user?.displayAvatarURL(),
        })

        .addFields(
            {
                name: "🟢 Process",

                value: `PID : ${process.pid}
Node : ${process.version}
Platform : ${process.platform}
Arch : ${process.arch}`,
            },

            {
                name: "💾 Memory",

                value: `RSS : ${(mem.rss / 1024 / 1024).toFixed(2)} MB
Heap Total : ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB
Heap Used : ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB
External : ${(mem.external / 1024 / 1024).toFixed(2)} MB`,
            },

            {
                name: "⏱ Runtime",

                value: `Uptime : ${Math.floor(process.uptime())} sec
Environment : ${process.env.NODE_ENV ?? "development"}`,
            }
        )

        .setFooter({
            text: "Debug Information",
        })

        .setTimestamp();

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
}

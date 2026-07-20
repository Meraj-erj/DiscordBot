import {
    ChatInputCommandInteraction,
    EmbedBuilder,
} from "discord.js";

import { monitoring } from "../index.js";

function bar(percent: number, size = 10): string {
    const filled = Math.round((percent / 100) * size);
    return "🟦".repeat(filled) + "⬛".repeat(size - filled);
}

function uptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export async function basicHandler(
    interaction: ChatInputCommandInteraction
) {
    const snapshot = monitoring.latest();

    if (!snapshot) {
        return interaction.reply({
            content: "Monitoring is not ready.",
            ephemeral: true,
        });
    }

    const ram =
        snapshot.system.memory.used /
        snapshot.system.memory.total *
        100;

    const disk =
        snapshot.system.disk.used /
        snapshot.system.disk.total *
        100;

    const embed = new EmbedBuilder()

        .setColor("#8b5cf6")

        .setAuthor({
            name: "Mary Monitor",
            iconURL: interaction.client.user?.displayAvatarURL()
        })

        .setThumbnail(
            interaction.client.user!.displayAvatarURL({
                size: 256
            })
        )

        .addFields(

            {
                name: "💻 Resources",
                value:
`**CPU**\n${bar(snapshot.system.cpu)} \`${snapshot.system.cpu.toFixed(1)}%\`

**Memory**\n${bar(ram)} \`${ram.toFixed(1)}%\`

**Disk**\n${bar(disk)} \`${disk.toFixed(1)}%\``,
                inline: true
            },

            {
                name: "⚡ Runtime",
                value:
`⏱ **Up**\n${uptime(snapshot.process.uptime)}

🧠 **RAM**
${Math.round(snapshot.process.memory / 1024 / 1024)} MB

🌐 **Ping**
${snapshot.discord.ping} ms`,
                inline: true
            },

            {
                name: "📈 CPU History",
                value:
"`▁▂▃▄▅▆▇▆▅▄▃▂▃▄▅▆`",
                inline: false
            }

        )

        .setFooter({
            text: "Mary Monitoring Framework"
        })

        .setTimestamp();

    await interaction.reply({
        embeds: [embed]
    });
}
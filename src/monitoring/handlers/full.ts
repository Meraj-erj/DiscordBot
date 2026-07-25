import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { monitoring } from "../index.js";

function bar(percent: number, size = 10): string {
    const filled = Math.round((percent / 100) * size);

    return "█".repeat(filled) + "░".repeat(size - filled);
}

function uptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);

    const m = Math.floor((seconds % 3600) / 60);

    return `${h}h ${m}m`;
}

function bytes(bytes: number): string {
    return (bytes / 1024 / 1024).toFixed(0) + " MB";
}

export async function fullHandler(interaction: ChatInputCommandInteraction) {
    const snapshot = monitoring.latest();

    if (!snapshot) {
        return interaction.reply({
            content: "Monitoring is not ready.",

            ephemeral: true,
        });
    }

    const memoryPercent = (snapshot.system.memory.used / snapshot.system.memory.total) * 100;

    const diskPercent = (snapshot.system.disk.used / snapshot.system.disk.total) * 100;

    const embed = new EmbedBuilder()

        .setColor("#8b5cf6")

        .setAuthor({
            name: "Mary • Full Monitor",

            iconURL: interaction.client.user?.displayAvatarURL(),
        })

        .setThumbnail(interaction.client.user!.displayAvatarURL())

        .addFields(
            {
                name: "💻 CPU",

                value: `Usage : **${snapshot.system.cpu.toFixed(1)}%**
${bar(snapshot.system.cpu)}`,

                inline: true,
            },

            {
                name: "🧠 Memory",

                value: `Used : **${bytes(snapshot.system.memory.used)}**
Free : **${bytes(snapshot.system.memory.free)}**

${bar(memoryPercent)}`,

                inline: true,
            },

            {
                name: "💾 Disk",

                value: `Used : **${bytes(snapshot.system.disk.used)}**
Free : **${bytes(snapshot.system.disk.free)}**

${bar(diskPercent)}`,

                inline: true,
            },

            {
                name: "🌐 Network",

                value: `⬇ ${(snapshot.system.network.download / 1024).toFixed(1)} KB/s
⬆ ${(snapshot.system.network.upload / 1024).toFixed(1)} KB/s`,

                inline: true,
            },

            {
                name: "🤖 Discord",

                value: `Ping : **${snapshot.discord.ping} ms**`,

                inline: true,
            },

            {
                name: "⚙ Runtime",

                value: `Uptime : **${uptime(snapshot.process.uptime)}**
Bot RAM : **${bytes(snapshot.process.memory)}**`,

                inline: true,
            },

            {
                name: "📈 CPU History",

                value: "`▁▂▃▄▅▆▇▆▅▄▃▂▃▄▅▆▇`",

                inline: false,
            }
        )

        .setFooter({
            text: "Mary Monitoring",
        })

        .setTimestamp();

    await interaction.reply({
        embeds: [embed],
        ephemeral: true,
    });
}

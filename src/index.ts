import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
    console.error("❌ DISCORD_TOKEN is missing");
    process.exit(1);
}

process.on("unhandledRejection", (error) => {
    console.error("❌ Unhandled Promise Rejection:");
    console.error(error);
});

process.on("uncaughtException", (error) => {
    console.error("❌ Uncaught Exception:");
    console.error(error);
});


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
});


async function startBot() {
    try {
        console.log("📦 Loading commands...");
        await loadCommands();

        console.log("📦 Loading events...");
        await loadEvents(client);

        console.log("🔑 Connecting to Discord...");

        await client.login(TOKEN);

        console.log("🚀 Bot is online");

    } catch (error) {
        console.error("❌ Startup failed:");
        console.error(error);

        process.exit(1);
    }
}


client.on("error", (error) => {
    console.error("❌ Discord Client Error:");
    console.error(error);
});


client.on("shardDisconnect", (event, shardId) => {
    console.warn(
        `⚠️ Shard ${shardId} disconnected`,
        event.code
    );
});


client.on("shardReconnecting", (shardId) => {
    console.log(
        `🔄 Shard ${shardId} reconnecting`
    );
});


client.on("shardReady", (shardId) => {
    console.log(
        `🟢 Shard ${shardId} ready`
    );
});


async function shutdown(signal: string) {
    console.log(`🛑 Received ${signal}`);

    await client.destroy();

    console.log("👋 Bot stopped");

    process.exit(0);
}


process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


startBot();
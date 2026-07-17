import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

console.log("📦 Loading commands...");
await loadCommands(client);

console.log("📦 Loading events...");
await loadEvents(client);

console.log("🔑 Logging in...");
await client.login(process.env.DISCORD_TOKEN);

console.log("🚀 Bot started.");
import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

import { loadCommands } from "./handlers/commandHandler.js";
import { deployCommands } from "./handlers/deployCommands.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("1️⃣ Loading commands...");
await loadCommands(client);
console.log("✅ Commands loaded.");

client.once("clientReady", async (client) => {
  console.log("2️⃣ clientReady fired!");
  console.log(`✅ Logged in as ${client.user.tag}`);

  try {
    console.log("3️⃣ Deploying commands...");
    await deployCommands();
    console.log("✅ Commands deployed!");
  } catch (err) {
    console.error("❌ Deploy Error:");
    console.error(err);
  }
});

console.log("4️⃣ Logging in...");
try {
  await client.login(process.env.DISCORD_TOKEN);
  console.log("✅ Login completed.");
} catch (err) {
  console.error("❌ Login Error:");
  console.error(err);
}
import { ConfigurationError } from "../errors/index.js";
import dotenv from "dotenv";

dotenv.config();

export const config = {
    token: process.env.DISCORD_TOKEN || "",
    clientId: process.env.CLIENT_ID || "",
    guildId: process.env.GUILD_ID || "",
    environment: process.env.NODE_ENV || "development",
    monitorRoleId: process.env.MONITOR_ROLE_ID!,
};

export function validateConfig() {
    const missing: string[] = [];

    if (!config.monitorRoleId) {
    missing.push("MONITOR_ROLE_ID");
}

    if (!config.token) missing.push("DISCORD_TOKEN");
    if (!config.clientId) missing.push("CLIENT_ID");
    if (!config.guildId) missing.push("GUILD_ID");

    if (missing.length > 0) {
        throw new ConfigurationError(
            `Missing environment variables: ${missing.join(", ")}`
        );
    }
}
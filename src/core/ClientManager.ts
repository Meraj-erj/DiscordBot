import { Client, GatewayIntentBits, type ClientOptions } from "discord.js";
import type { Dispatcher } from "undici";

import logger from "../logger/logger.js";
import { DiscordConnectionError, ErrorFactory, ErrorFormatter } from "../errors/index.js";

import { validateConfig } from "../config/config.js";

export class ClientManager {
    private readonly client: Client;

    constructor(restAgent?: Dispatcher) {
        validateConfig();

        const options: ClientOptions = {
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
            ...(restAgent ? { rest: { agent: restAgent } } : {}),
        };

        this.client = new Client(options);

        this.registerEvents();
    }

    public getClient(): Client {
        return this.client;
    }

    public async login(): Promise<void> {
        const maxAttempts = 5;

        let attempt = 1;

        while (attempt <= maxAttempts) {
            try {
                logger.info("Retry", `Attempt ${attempt}/${maxAttempts}`);

                logger.info("ClientManager", "Connecting to Discord...");

                await this.client.login(process.env.DISCORD_TOKEN);

                logger.info("ClientManager", "Discord connection established");

                return;
            } catch (error) {
                const frameworkError = ErrorFactory.create(error);

                logger.error(
                    "ClientManager",

                    ErrorFormatter.format(frameworkError)
                );

                if (attempt >= maxAttempts) {
                    throw new DiscordConnectionError(
                        "Unable to connect to Discord after maximum retry attempts."
                    );
                }

                const delay = Math.min(5000 * attempt, 60000);

                logger.warn(
                    "Retry",

                    `Retrying in ${delay} ms`
                );

                await new Promise((resolve) => setTimeout(resolve, delay));

                attempt++;
            }
        }
    }

    public async destroy(): Promise<void> {
        logger.info("ClientManager", "Closing Discord connection");

        this.client.destroy();

        logger.info("ClientManager", "Discord client destroyed");
    }

    private registerEvents(): void {
        this.client.on("error", (error) => {
            const frameworkError = ErrorFactory.create(error);

            logger.error(
                "DiscordClient",

                ErrorFormatter.format(frameworkError)
            );
        });

        this.client.on("shardReady", (id) => {
            logger.info(
                "ClientManager",

                `Shard ${id} ready`
            );
        });

        this.client.on("shardDisconnect", (event, id) => {
            logger.warn(
                "ClientManager",

                `Shard ${id} disconnected (${event.code})`
            );
        });

        this.client.on("shardReconnecting", (id) => {
            logger.info(
                "ClientManager",

                `Shard ${id} reconnecting`
            );
        });
    }
}

import { Client, GatewayIntentBits } from "discord.js";
import { Retry } from "../utils/Retry.js";
import { config } from "../config/config.js";
import logger from "../logger/logger.js";

export class ClientManager {
    private readonly client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
            ],
        });

        this.registerEvents();
    }

    public getClient(): Client {
        return this.client;
    }

public async login(): Promise<void> {

    await Retry.run(
        async () => {

            logger.info(
                "ClientManager",
                "Connecting to Discord..."
            );

            await this.client.login(config.token);

            logger.info(
                "ClientManager",
                "Discord connection established"
            );

        },
        {
            retries: Infinity,
            delay: 5000,
            factor: 2,
            maxDelay: 60000,
        }
    );

}

    public async destroy(): Promise<void> {
        logger.info(
            "ClientManager",
            "Closing Discord connection"
        );

        this.client.destroy();

        logger.info(
            "ClientManager",
            "Discord client destroyed"
        );
    }

    private registerEvents(): void {

        this.client.on("error", (error) => {
            logger.error(
                "ClientManager",
                "Discord Client Error", error
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
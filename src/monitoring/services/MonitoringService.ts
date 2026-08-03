import type { Client } from "discord.js";
import logger from "../../logger/logger.js";

import { HistoryBuffer } from "../history/HistoryBuffer.js";
import { SystemProvider } from "../providers/SystemProvider.js";

export class MonitoringService {
    private readonly provider: SystemProvider;

    private readonly history = new HistoryBuffer();

    private timer: NodeJS.Timeout | undefined;

    private running = false;

    constructor(client: Client) {
        this.provider = new SystemProvider(client);
    }

    public start(interval = 1000): void {
        if (this.running) return;

        this.running = true;

        const collect = async (): Promise<void> => {
            if (!this.running) return;

            try {
                const snapshot = await this.provider.collect();

                this.history.add(snapshot);
            } catch (error) {
                if (error instanceof Error) {
                    logger.error("Monitoring", error.message);
                }
            } finally {
                if (this.running) {
                    this.timer = setTimeout(() => {
                        this.timer = undefined;

                        void collect();
                    }, interval);
                }
            }
        };

        void collect();
    }

    public stop(): void {
        this.running = false;

        if (this.timer) {
            clearTimeout(this.timer);

            this.timer = undefined;
        }
    }

    public getHistory() {
        return this.history.getAll();
    }

    public latest() {
        return this.history.latest();
    }
}
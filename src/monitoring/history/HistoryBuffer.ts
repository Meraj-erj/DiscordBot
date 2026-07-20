import type { MonitoringSnapshot } from "../models/MonitoringSnapshot.js";

export class HistoryBuffer {

    private readonly history: MonitoringSnapshot[] = [];

    private readonly maxAge = 30 * 60 * 1000; // 30 minutes

    public add(snapshot: MonitoringSnapshot): void {

        this.history.push(snapshot);

        this.cleanup();
    }

    public getAll(): readonly MonitoringSnapshot[] {

        return this.history;
    }

    public latest(): MonitoringSnapshot | undefined {

        return this.history.at(-1);
    }

    public clear(): void {

        this.history.length = 0;
    }

    private cleanup(): void {

        const cutoff = Date.now() - this.maxAge;

        while (
            this.history.length > 0 &&
            this.history[0].timestamp < cutoff
        ) {
            this.history.shift();
        }
    }

}
import type { Client } from "discord.js";

import { HistoryBuffer } from "../history/HistoryBuffer.js";
import { SystemProvider } from "../providers/SystemProvider.js";


export class MonitoringService {

    private readonly provider: SystemProvider;

    private readonly history = new HistoryBuffer();

    private timer?: NodeJS.Timeout;


    constructor(
        client: Client
    ) {

        this.provider = new SystemProvider(
            client
        );

    }



    public start(interval = 1000): void {

        if (this.timer) return;


        this.timer = setInterval(
            async () => {

                try {

                    const snapshot =
                        await this.provider.collect();


                    this.history.add(
                        snapshot
                    );


                } catch (error) {

                    console.error(error);

                }


            },
            interval
        );

    }



    public stop(): void {

        if (!this.timer) return;


        clearInterval(
            this.timer
        );


        this.timer = undefined;

    }



    public getHistory() {

        return this.history.getAll();

    }



    public latest() {

        return this.history.latest();

    }

}
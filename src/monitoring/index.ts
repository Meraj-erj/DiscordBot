import type { Client } from "discord.js";

import { MonitoringService } from "./services/MonitoringService.js";


let instance: MonitoringService | null = null;


export const monitoring = {

    initialize(client: Client) {

        if (!instance) {

            instance = new MonitoringService(
                client
            );

        }

    },


    start() {

        if (!instance) {

            throw new Error(
                "Monitoring not initialized"
            );

        }


        instance.start();

    },


    stop() {

        if (!instance) return;


        instance.stop();

    },


    latest() {

        if (!instance) return undefined;


        return instance.latest();

    },


    getHistory() {

        if (!instance) return [];


        return instance.getHistory();

    }

};
import os from "node:os";
import si from "systeminformation";

import type { Client } from "discord.js";

import type { MonitoringSnapshot } from "../models/MonitoringSnapshot.js";

export class SystemProvider {
    private lastCpuUsage = process.cpuUsage();
    private lastTime = Date.now();

    constructor(private readonly client: Client) {}

    public async collect(): Promise<MonitoringSnapshot> {
        const [currentLoad, mem, fs, network] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.fsSize(),
            si.networkStats(),
        ]);

        const now = Date.now();

        const cpuUsage = process.cpuUsage(this.lastCpuUsage);

        const elapsed = now - this.lastTime;

        const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000 / elapsed) * 100;

        this.lastCpuUsage = process.cpuUsage();
        this.lastTime = now;

        return {
            timestamp: Date.now(),

            process: {
                cpu: Number(cpuPercent.toFixed(2)),

                memory: process.memoryUsage().rss,

                uptime: process.uptime(),
            },

            system: {
                cpu: currentLoad.currentLoad,

                memory: {
                    total: mem.total,
                    used: mem.used,
                    free: mem.free,
                },

                disk: {
                    total: fs[0]?.size ?? 0,

                    used: fs[0]?.used ?? 0,

                    free: (fs[0]?.size ?? 0) - (fs[0]?.used ?? 0),
                },

                network: {
                    upload: network[0]?.tx_sec ?? 0,

                    download: network[0]?.rx_sec ?? 0,
                },

                loadAverage: os.loadavg(),
            },

            discord: {
                ping: this.client.ws.ping,
            },
        };
    }
}

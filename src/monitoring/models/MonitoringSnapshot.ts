export interface MonitoringSnapshot {
    timestamp: number;

    process: {
        cpu: number;
        memory: number;
        uptime: number;
    };

    system: {
        cpu: number;
        memory: {
            total: number;
            used: number;
            free: number;
        };

        disk: {
            total: number;
            used: number;
            free: number;
        };

        network: {
            upload: number;
            download: number;
        };

        loadAverage: number[];
    };

    discord: {
        ping: number;
    };
}

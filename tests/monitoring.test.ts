import { afterEach, describe, expect, it, vi } from "vitest";

import type { MonitoringSnapshot } from "../src/monitoring/models/MonitoringSnapshot.js";
import { MonitoringService } from "../src/monitoring/services/MonitoringService.js";

describe("MonitoringService", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("should not start a second collection while the first is running", async () => {
        vi.useFakeTimers();

        const service = new MonitoringService({} as never);

        const provider = (
            service as unknown as {
                provider: {
                    collect: () => Promise<MonitoringSnapshot>;
                };
            }
        ).provider;

        const snapshot: MonitoringSnapshot = {
            timestamp: Date.now(),
            process: {
                cpu: 0,
                memory: 0,
                uptime: 0,
            },
            system: {
                cpu: 0,
                memory: {
                    total: 0,
                    used: 0,
                    free: 0,
                },
                disk: {
                    total: 0,
                    used: 0,
                    free: 0,
                },
                network: {
                    upload: 0,
                    download: 0,
                },
                loadAverage: [],
            },
            discord: {
                ping: 0,
            },
        };

        let resolveFirst: (() => void) | undefined;

        const firstCollection = new Promise<MonitoringSnapshot>((resolve) => {
            resolveFirst = () => resolve(snapshot);
        });

        const collect = vi
            .spyOn(provider, "collect")
            .mockReturnValueOnce(firstCollection)
            .mockResolvedValue(snapshot);

        service.start(1000);

        expect(collect).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(5000);

        expect(collect).toHaveBeenCalledTimes(1);

        resolveFirst?.();

        await vi.advanceTimersByTimeAsync(1000);

        expect(collect).toHaveBeenCalledTimes(2);

        service.stop();
    });
});
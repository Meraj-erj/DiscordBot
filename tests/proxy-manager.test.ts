import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProxyManager } from "../src/proxy/ProxyManager.js";

describe("ProxyManager", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();

        process.env = { ...originalEnv };
    });

    it("should initialize without proxy when proxy is disabled", async () => {
        process.env.PROXY_ENABLED = "false";

        const manager = new ProxyManager();

        await manager.initialize();

        expect(manager.isEnabled()).toBe(false);
        expect(manager.getRestAgent()).toBeUndefined();

        manager.shutdown();
    });

    it("should initialize successfully with an HTTP proxy", async () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "http";
        process.env.PROXY_URL = "http://127.0.0.1:8080";
        process.env.PROXY_HEALTHCHECK_INTERVAL_MS = "60000";

        const reachabilityCheck = vi
            .spyOn(
                ProxyManager.prototype as unknown as {
                    checkProxyReachable: () => Promise<void>;
                },
                "checkProxyReachable"
            )
            .mockResolvedValue(undefined);

        const manager = new ProxyManager();

        await manager.initialize();

        expect(manager.isEnabled()).toBe(true);
        expect(manager.getConfig().type).toBe("http");
        expect(manager.getRestAgent()).toBeDefined();
        expect(reachabilityCheck).toHaveBeenCalledTimes(1);

        manager.shutdown();
    });

    it("should stop the health check timer on shutdown", async () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "http";
        process.env.PROXY_URL = "http://127.0.0.1:8080";
        process.env.PROXY_HEALTHCHECK_INTERVAL_MS = "1000";

        const reachabilityCheck = vi
            .spyOn(
                ProxyManager.prototype as unknown as {
                    checkProxyReachable: () => Promise<void>;
                },
                "checkProxyReachable"
            )
            .mockResolvedValue(undefined);

        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

        const manager = new ProxyManager();

        await manager.initialize();

        expect(reachabilityCheck).toHaveBeenCalledTimes(1);

        manager.shutdown();

        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
    });
});
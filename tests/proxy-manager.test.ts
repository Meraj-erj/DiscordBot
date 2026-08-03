import { afterEach, describe, expect, it, vi } from "vitest";

import { ProxyManager } from "../src/proxy/ProxyManager.js";

describe("ProxyManager", () => {
    afterEach(() => {
        vi.restoreAllMocks();

        delete process.env.PROXY_ENABLED;
        delete process.env.PROXY_TYPE;
        delete process.env.PROXY_URL;
    });

    it("should initialize without proxy when proxy is disabled", async () => {
        process.env.PROXY_ENABLED = "false";

        const manager = new ProxyManager();

        await manager.initialize();

        expect(manager.isEnabled()).toBe(false);
        expect(manager.getRestAgent()).toBeUndefined();

        manager.shutdown();
    });
});
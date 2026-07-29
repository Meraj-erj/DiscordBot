import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { loadProxyConfig, validateProxyConfig } from "../src/proxy/ProxyConfig.js";
import { ProxyAgentFactory } from "../src/proxy/ProxyAgentFactory.js";
import { ProxyError } from "../src/errors/index.js";

describe("ProxyConfig", () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        process.env = { ...originalEnv };
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    it("should be disabled by default", () => {
        delete process.env.PROXY_ENABLED;

        const config = loadProxyConfig();

        expect(config.enabled).toBe(false);
    });

    it("should not require PROXY_URL when disabled", () => {
        process.env.PROXY_ENABLED = "false";
        delete process.env.PROXY_URL;

        expect(() => loadProxyConfig()).not.toThrow();
    });

    it("should throw when enabled without PROXY_URL", () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "http";
        delete process.env.PROXY_URL;

        expect(() => loadProxyConfig()).toThrow(ProxyError);
    });

    it("should throw for an invalid proxy type", () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "ftp";
        process.env.PROXY_URL = "http://127.0.0.1:8080";

        expect(() => loadProxyConfig()).toThrow(ProxyError);
    });

    it("should accept a valid http proxy configuration", () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "http";
        process.env.PROXY_URL = "http://127.0.0.1:8080";

        const config = loadProxyConfig();

        expect(() => validateProxyConfig(config)).not.toThrow();
        expect(config.type).toBe("http");
    });

    it("should accept a valid socks5 proxy configuration", () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "socks5";
        process.env.PROXY_URL = "socks5://127.0.0.1:1080";

        const config = loadProxyConfig();

        expect(config.type).toBe("socks5");
    });

    it("should reject a malformed PROXY_URL", () => {
        process.env.PROXY_ENABLED = "true";
        process.env.PROXY_TYPE = "http";
        process.env.PROXY_URL = "not-a-valid-url";

        expect(() => loadProxyConfig()).toThrow(ProxyError);
    });
});

describe("ProxyAgentFactory", () => {
    it("should not produce core agents for an http proxy (uses global-agent instead)", () => {
        const agents = ProxyAgentFactory.create({
            enabled: true,
            type: "http",
            url: "http://127.0.0.1:8080",
            connectTimeoutMs: 1000,
            healthCheckIntervalMs: 1000,
            retry: { delay: 100, factor: 2, maxDelay: 1000 },
        });

        expect(agents.dispatcher).toBeDefined();
        expect(agents.coreAgents).toBeUndefined();
    });

    it("should produce core agents for a socks5 proxy", () => {
        const agents = ProxyAgentFactory.create({
            enabled: true,
            type: "socks5",
            url: "socks5://127.0.0.1:1080",
            connectTimeoutMs: 1000,
            healthCheckIntervalMs: 1000,
            retry: { delay: 100, factor: 2, maxDelay: 1000 },
        });

        expect(agents.dispatcher).toBeDefined();
        expect(agents.coreAgents).toBeDefined();
        expect(agents.coreAgents?.httpAgent).toBeDefined();
        expect(agents.coreAgents?.httpsAgent).toBeDefined();
    });
});

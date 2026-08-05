import { ProxyError } from "../errors/index.js";

export type ProxyType = "http" | "https" | "socks5";

export interface ProxyRetryConfig {
    delay: number;
    factor: number;
    maxDelay: number;
}

export interface ProxyConfig {
    enabled: boolean;
    type: ProxyType;
    url: string;
    connectTimeoutMs: number;
    healthCheckIntervalMs: number;
    restKeepAliveIntervalMs: number;
    retry: ProxyRetryConfig;
}

const VALID_TYPES: readonly ProxyType[] = ["http", "https", "socks5"];

function parseBoolean(value: string | undefined): boolean {
    return value?.toLowerCase() === "true";
}

function parseNumber(value: string | undefined, fallback: number): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function validateProxyConfig(config: ProxyConfig): void {
    if (!VALID_TYPES.includes(config.type)) {
        throw new ProxyError(
            `Invalid PROXY_TYPE '${config.type}'. Expected one of: ${VALID_TYPES.join(", ")}.`
        );
    }

    if (!config.url) {
        throw new ProxyError("PROXY_URL is required when PROXY_ENABLED is true.");
    }

    let parsed: URL;

    try {
        parsed = new URL(config.url);
    } catch (error) {
        throw new ProxyError(
            `PROXY_URL is not a valid URL: ${config.url}`,
            undefined,
            undefined,
            "Provide a URL such as http://user:pass@host:port or socks5://host:port",
            error instanceof Error ? error : undefined
        );
    }

    const expectedProtocol = `${config.type}:`;

    if (parsed.protocol !== expectedProtocol) {
        throw new ProxyError(
            `PROXY_URL protocol '${parsed.protocol}' does not match PROXY_TYPE '${config.type}'.`
        );
    }

    if (!parsed.hostname) {
        throw new ProxyError("PROXY_URL must include a proxy hostname.");
    }
}

export function loadProxyConfig(): ProxyConfig {
    const enabled = parseBoolean(process.env.PROXY_ENABLED);

    const type = (process.env.PROXY_TYPE ?? "http").toLowerCase() as ProxyType;

    const url = process.env.PROXY_URL ?? "";

    const config: ProxyConfig = {
        enabled,

        type,

        url,

        connectTimeoutMs: parseNumber(process.env.PROXY_CONNECT_TIMEOUT_MS, 10000),

        healthCheckIntervalMs: parseNumber(process.env.PROXY_HEALTHCHECK_INTERVAL_MS, 60000),

        restKeepAliveIntervalMs: parseNumber(process.env.PROXY_REST_KEEPALIVE_INTERVAL_MS, 240000),

        retry: {
            delay: parseNumber(process.env.PROXY_RETRY_DELAY_MS, 5000),

            factor: parseNumber(process.env.PROXY_RETRY_FACTOR, 2),

            maxDelay: parseNumber(process.env.PROXY_RETRY_MAX_DELAY_MS, 60000),
        },
    };

    if (config.enabled) {
        validateProxyConfig(config);
    }

    return config;
}

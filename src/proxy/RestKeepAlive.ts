import type { Client } from "discord.js";
import { Routes } from "discord.js";

import logger from "../logger/logger.js";
import { ErrorFactory, ErrorFormatter } from "../errors/index.js";

/**
 * Periodically issues a trivial REST call to Discord to keep the underlying
 * proxied connection pool warm.
 *
 * Some HTTP/SOCKS5 proxies close idle connections after a period of inactivity
 * (commonly 5-15 minutes). The next REST call then has to renegotiate the full
 * proxy tunnel and TLS handshake from scratch, which can push a slash-command
 * acknowledgment past Discord's 3-second interaction response window and
 * produce `DiscordAPIError[10062]: Unknown interaction`.
 *
 * Only started when the proxy is enabled, since a direct connection to Discord
 * does not exhibit this failure mode.
 */
export class RestKeepAlive {
    private timer: NodeJS.Timeout | undefined;

    constructor(
        private readonly client: Client,
        private readonly intervalMs: number
    ) {}

    public start(): void {
        if (this.timer) {
            return;
        }

        this.timer = setInterval(() => {
            void this.ping();
        }, this.intervalMs);

        this.timer.unref?.();

        logger.info("Proxy", `REST keep-alive started (every ${this.intervalMs} ms).`);
    }

    public stop(): void {
        if (!this.timer) {
            return;
        }

        clearInterval(this.timer);

        this.timer = undefined;
    }

    private async ping(): Promise<void> {
        try {
            await this.client.rest.get(Routes.gateway());
        } catch (error) {
            const frameworkError = ErrorFactory.create(error);

            logger.warn("Proxy", ErrorFormatter.format(frameworkError));
            logger.warn("Proxy", "REST keep-alive ping failed; connection may be cold.");
        }
    }
}

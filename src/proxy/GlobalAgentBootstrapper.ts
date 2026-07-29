import { bootstrap } from "global-agent";

import logger from "../logger/logger.js";

import type { ProxyConfig } from "./ProxyConfig.js";

/**
 * Routes Node's core `http.request` / `https.request` calls through an HTTP or HTTPS
 * proxy by delegating to the `global-agent` package.
 *
 * This exists specifically for the Discord Gateway WebSocket handshake performed by
 * `@discordjs/ws`. As installed in this project (v1.2.3), that package exposes no
 * public proxy/agent option, and a plain `http.globalAgent` / `https.globalAgent`
 * reassignment was verified NOT to be honored by its handshake request.
 *
 * `global-agent` works at a lower level: it monkey-patches the `http.request` and
 * `https.request` entrypoints themselves (via `bootstrap()`), rather than only
 * changing the default agent that gets looked up when the caller supplies none. This
 * is the mechanism the official discord.js proxy guide recommends for the WebSocket
 * layer: https://discordjs.guide/legacy/additional-info/proxy
 *
 * Limitation: `global-agent` only understands `http://` / `https://` proxy URLs. It
 * has no concept of `socks5://`, so this class is only used for those two proxy
 * types. See `ProxyManager` for how `socks5` is handled instead.
 *
 * Limitation: `global-agent` does not expose an official "uninstall" — once
 * `bootstrap()` runs, the patched `http.request` / `https.request` remain patched
 * for the lifetime of the process. `ProxyManager.shutdown()` cannot fully undo this;
 * it is documented there as well.
 */
export class GlobalAgentBootstrapper {
    private installed = false;

    public install(config: ProxyConfig): void {
        if (this.installed) {
            return;
        }

        process.env.GLOBAL_AGENT_HTTP_PROXY = config.url;
        process.env.GLOBAL_AGENT_HTTPS_PROXY = config.url;
        process.env.GLOBAL_AGENT_NO_PROXY = process.env.GLOBAL_AGENT_NO_PROXY ?? "";

        bootstrap();

        this.installed = true;

        logger.info("Proxy", "Global HTTP/HTTPS agent patched for Gateway traffic.");
    }

    public isInstalled(): boolean {
        return this.installed;
    }
}

# Configuration

This document explains the configuration system used by DiscordBot.

The project uses environment variables to store sensitive information
and application settings.

---

## Environment Variables

The bot configuration is stored inside a `.env` file located in the
project root directory.

Example:

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
NODE_ENV=

PROXY_ENABLED=false
PROXY_TYPE=http
PROXY_URL=
```

---

## Variables

| Variable      | Required | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| DISCORD_TOKEN | Yes      | Authentication token used to connect the bot to Discord |
| CLIENT_ID     | Yes      | Discord application identifier                          |
| GUILD_ID      | Yes      | Development server identifier                           |
| NODE_ENV      | No       | Application environment                                 |

---

## Discord Token

`DISCORD_TOKEN` is used by the Discord client to authenticate with
Discord Gateway.

Example:

```env
DISCORD_TOKEN=your_bot_token
```

Important:

- Never share your bot token
- Never commit `.env` files
- Rotate the token if it becomes exposed

---

## Client ID

`CLIENT_ID` represents the Discord application ID.

It is required for registering and deploying slash commands.

Example:

```env
CLIENT_ID=application_id
```

---

## Guild ID

`GUILD_ID` is the Discord server identifier used during development.

Guild command deployment allows faster command updates while developing.

Example:

```env
GUILD_ID=server_id
```

---

## Environment Modes

The application can run in different environments.

Example:

```env
NODE_ENV=development
```

Possible values:

| Value       | Purpose               |
| ----------- | --------------------- |
| development | Local development     |
| production  | Production deployment |

---

## Proxy Configuration

DiscordBot can route **all Discord traffic** (REST API and Gateway
handshake) through an HTTP, HTTPS, or SOCKS5 proxy. This is intended
for environments where Discord is blocked at the network level.

| Variable                      | Required   | Default | Description                                               |
| ----------------------------- | ---------- | ------- | --------------------------------------------------------- |
| PROXY_ENABLED                 | No         | false   | `true` to route Discord traffic through a proxy           |
| PROXY_TYPE                    | If enabled | http    | `http`, `https`, or `socks5`                              |
| PROXY_URL                     | If enabled | -       | e.g. `http://user:pass@host:port` or `socks5://host:port` |
| PROXY_CONNECT_TIMEOUT_MS      | No         | 10000   | Timeout for the initial proxy connectivity check          |
| PROXY_HEALTHCHECK_INTERVAL_MS | No         | 60000   | Interval for the background proxy health monitor          |
| PROXY_RETRY_DELAY_MS          | No         | 5000    | Initial delay before retrying a failed proxy connection   |
| PROXY_RETRY_FACTOR            | No         | 2       | Exponential backoff multiplier                            |
| PROXY_RETRY_MAX_DELAY_MS      | No         | 60000   | Maximum backoff delay                                     |

When `PROXY_ENABLED` is `false` (or unset), nothing in the application's
behavior changes — no agents are created, no globals are overridden.

Example:

```env
PROXY_ENABLED=true
PROXY_TYPE=socks5
PROXY_URL=socks5://127.0.0.1:1080
```

---

## Security Recommendations

For security reasons:

- Keep `.env` private
- Add `.env` to `.gitignore`
- Do not expose Discord credentials
- Do not expose proxy credentials embedded in `PROXY_URL`
- Use different tokens for development and production

---

## Configuration Flow

```
.env File

    |

    v

Configuration Loader (bot config + proxy config)

    |

    v

Application Services

    |

    v

Discord Client
```

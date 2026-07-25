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
```

---

## Variables

| Variable | Required | Description |
|---|---|---|
| DISCORD_TOKEN | Yes | Authentication token used to connect the bot to Discord |
| CLIENT_ID | Yes | Discord application identifier |
| GUILD_ID | Yes | Development server identifier |
| NODE_ENV | No | Application environment |

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

| Value | Purpose |
|---|---|
| development | Local development |
| production | Production deployment |

---

## Security Recommendations

For security reasons:

- Keep `.env` private
- Add `.env` to `.gitignore`
- Do not expose Discord credentials
- Use different tokens for development and production

---

## Configuration Flow

```
.env File

    |

    v

Configuration Loader

    |

    v

Application Services

    |

    v

Discord Client
```
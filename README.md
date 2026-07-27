# DiscordBot

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![CI](https://github.com/Meraj-erj/DiscordBot/actions/workflows/ci.yml/badge.svg)](https://github.com/Meraj-erj/DiscordBot/actions/workflows/ci.yml)

A Discord bot built with **TypeScript** and **Discord.js v14**.

This project is focused on creating a clean, organized, and maintainable Discord bot structure that can be expanded with new features over time.

Instead of putting everything into a single file, the bot uses a modular architecture where commands, events, services, and internal systems are separated to keep the code easier to understand and maintain.

Current features include:

- Modular Slash Commands
- Dynamic Event Loading
- Dependency Injection Container
- Configuration Management
- Structured Logging
- System Monitoring
- Role-Based Command Permissions
- Error Handling
- Type-Safe Development with TypeScript

---

## Features

### Command System

The bot uses a modular command system where each slash command is separated into its own file.

This makes adding new commands easier and keeps the project structure clean.

Current commands:

- `/ping`
- `/mon`

---

## Monitoring System

The monitoring system allows authorized users to check information about the bot and its environment.

Available commands:

```bash
/mon basic
/mon full
/mon debug
```

The monitoring system provides information such as:

- CPU usage
- Memory usage
- Disk usage
- Running process information
- Node.js runtime details
- Discord connection latency
- Basic system diagnostics

Monitoring commands are protected using role-based permissions.

---

## Security

The bot follows several security practices:

- Sensitive data is stored using environment variables
- Bot tokens are never stored directly in the code
- Administrative commands have permission checks
- Users receive safe error messages
- Detailed errors are stored internally through logging

---

## Requirements

- Node.js 22+
- npm

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Meraj-erj/DiscordBot.git

cd DiscordBot
```

Install dependencies:

```bash
npm install
```

---

## Configuration

Create a `.env` file in the project root:

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
MONITOR_ROLE_ID=YOUR_MONITOR_ROLE_ID
```

### Environment Variables

| Variable        | Description                             |
| --------------- | --------------------------------------- |
| DISCORD_TOKEN   | Discord bot authentication token        |
| CLIENT_ID       | Discord application ID                  |
| GUILD_ID        | Development server ID                   |
| MONITOR_ROLE_ID | Role allowed to use monitoring commands |

---

## Development

Run the bot in development mode:

```bash
npm run dev
```

The development environment uses TypeScript runtime execution with automatic reload.

---

## Build

Compile the TypeScript project:

```bash
npm run build
```

---

## Production

Start the compiled bot:

```bash
npm start
```

---

## Deploy Commands

Register slash commands with Discord:

```bash
npm run deploy
```

---

## Available Scripts

| Command            | Description            |
| ------------------ | ---------------------- |
| `npm run dev`      | Start development mode |
| `npm run build`    | Compile TypeScript     |
| `npm start`        | Start production bot   |
| `npm run deploy`   | Deploy slash commands  |
| `npm run lint`     | Check code quality     |
| `npm run lint:fix` | Fix lint problems      |
| `npm run format`   | Format code            |
| `npm run clean`    | Remove build files     |

---

## Project Structure

```text
src/
├── commands/        # Slash commands
├── config/          # Environment configuration
├── container/       # Dependency injection
├── core/            # Bot lifecycle management
├── errors/          # Error handling
├── events/          # Discord events
├── handlers/        # Command and event loaders
├── interfaces/      # TypeScript interfaces
├── logger/          # Logging system
├── monitoring/      # Monitoring features
├── utils/           # Helper functions
├── validators/      # Validation logic
└── index.ts         # Bot entry point
```

---

## Architecture

The project is built around a few main principles:

- Clean and readable code
- Separation of responsibilities
- Strong TypeScript typing
- Modular components
- Reusable systems
- Easier future development

The goal is to have a Discord bot structure that remains simple to maintain while allowing new features to be added without rewriting the entire project.

---

## Version

This project follows Semantic Versioning.

Current version:

```
v0.2.1
```

### Release History

- `v0.2.0` - Added monitoring system
- `v0.2.1` - Added role-based permissions for monitoring commands

## Documentation

Detailed project documentation:

- [Architecture](./docs/architecture.md)
- [Setup Guide](./docs/setup.md)
- [Configuration](./docs/configuration.md)
- [Commands](./docs/commands.md)
- [Events](./docs/events.md)
- [Services](./docs/services.md)
- [Security](./docs/security.md)
- [Deployment](./docs/deployment.md)
- [Roadmap](./docs/roadmap.md)

---

## License

This project is licensed under the MIT License.

# Setup Guide

This guide explains how to install, configure, and run DiscordBot locally.

---

## Requirements

Before running the project, make sure the following tools are installed:

- Node.js 22+
- npm
- Git

Check installed versions:

```bash
node -v
npm -v
git --version
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Meraj-erj/DiscordBot.git
```

Move into the project directory:

```bash
cd DiscordBot
```

Install project dependencies:

```bash
npm install
```

---

## Environment Configuration

The bot requires environment variables to connect to Discord.

Create a `.env` file in the root directory:

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
```

### Environment Variables

| Variable | Description |
|---|---|
| DISCORD_TOKEN | Discord bot authentication token |
| CLIENT_ID | Discord application ID |
| GUILD_ID | Development server ID |

---

## Running the Project

### Development Mode

Run the bot in development mode:

```bash
npm run dev
```

Development mode provides automatic TypeScript execution and faster development workflow.

---

## Production Build

Compile the TypeScript source code:

```bash
npm run build
```

After building the project, start the production version:

```bash
npm start
```

---

## Available Scripts

| Command | Description |
|---|---|
| npm run dev | Start development mode |
| npm run build | Compile TypeScript |
| npm start | Run production build |
| npm run lint | Check code quality |
| npm run format | Format code using Prettier |
| npm run deploy | Deploy Discord commands |

---

## Troubleshooting

### Bot fails to start

Check the following:

- Environment variables are configured correctly
- Discord token is valid
- Required Discord intents are enabled
- Dependencies are installed correctly

---

### Slash commands are not updated

Deploy commands again:

```bash
npm run deploy
```

---

## Development Workflow

A typical development workflow:

1. Install dependencies
2. Configure environment variables
3. Run development mode
4. Implement changes
5. Run lint and build checks
6. Commit changes

Example:

```bash
npm run lint
npm run build
```

---

## Next Steps

After completing the setup, read the following documentation:

- Architecture
- Configuration
- Commands
- Events
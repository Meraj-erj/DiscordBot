# DiscordBot

DiscordBot is a Discord bot built with TypeScript and Discord.js. The project focuses on providing a clean and maintainable codebase that can be extended over time without major architectural changes.

The current implementation includes a modular command system, dynamic event loading, logging, monitoring utilities, dependency injection, and configuration management.

---

## Requirements

* Node.js 22 or later
* npm

---

## Installation

Clone the repository and install the dependencies.

```bash
git clone https://github.com/Meraj-erj/DiscordBot.git

cd DiscordBot

npm install
```

---

## Configuration

Create a `.env` file in the project root.

```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
```

---

## Development

Start the development server.

```bash
npm run dev
```

---

## Build

Compile the project.

```bash
npm run build
```

---

## Run

Run the compiled application.

```bash
npm start
```

---

## Deploy Commands

Register or update slash commands.

```bash
npm run deploy
```

---

## Project Structure

```text
src/
├── commands/
├── config/
├── container/
├── core/
├── deploy/
├── errors/
├── events/
├── handlers/
├── interfaces/
├── monitoring/
├── utils/
├── validators/
└── index.ts
```

---

## Project Goals

The project is designed around a small set of principles:

* Clear project structure
* Strong type safety
* Separation of concerns
* Reusable components
* Long-term maintainability

Additional features and modules will be added as the project evolves.

---

## License

This project is licensed under the MIT License.

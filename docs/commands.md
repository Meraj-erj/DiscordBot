# Commands

This document explains the command system used by DiscordBot.

The bot uses Discord Slash Commands built with discord.js v14.

Commands are separated into individual modules to keep the codebase
organized and easy to extend.

---

## Command Structure

Commands are stored inside the `commands` directory.

Example:

```
src/
└── commands/
    └── ping.ts
```

Each command contains its own:

- Command definition
- Options
- Execution logic

---

## Command Flow

When a user runs a slash command, the following process happens:

```
User

 |

 v

Discord Interaction

 |

 v

interactionCreate Event

 |

 v

Command Handler

 |

 v

Command Execute Function

 |

 v

Bot Response
```

---

## Creating a New Command

To create a new command:

1. Create a new file inside:

```
src/commands/
```

Example:

```
src/commands/example.ts
```

2. Define the command information.

3. Add the execution logic.

Example structure:

```ts
export default {
    data: commandData,

    async execute(interaction) {
        // command logic
    }
}
```

---

## Command Loading

Commands are loaded dynamically by the command handler.

The handler:

- Searches command files
- Imports command modules
- Registers commands
- Makes them available to Discord

This approach allows new commands to be added without modifying the main application file.

---

## Command Deployment

After creating or updating slash commands, commands need to be deployed.

Run:

```bash
npm run deploy
```

The deployment process registers commands with Discord.

---

## Current Commands

### `/ping`

Description:

Checks bot response time and confirms that the bot is online.

Example:

```
/ping
```

Response:

```
Pong!
```

---

## Best Practices

When creating commands:

- Keep each command in its own file
- Avoid putting business logic directly inside commands
- Use services for reusable logic
- Validate user input
- Keep command names descriptive

---

## Future Improvements

Possible command system improvements:

- Command categories
- Permission-based commands
- Cooldowns
- Command analytics
- Advanced command options
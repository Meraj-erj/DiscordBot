# Events

This document explains the event system used by DiscordBot.

Discord.js uses events to handle actions and updates received from
the Discord Gateway.

The project uses a modular event structure where each event is separated
into its own file.

---

## Event Structure

Events are stored inside the `events` directory.

Example:

```
src/
└── events/
    ├── ready.ts
    └── interactionCreate.ts
```

Each event module contains:

- Event name
- Event handler logic
- Execution function

---

## Event Flow

When Discord sends an event, the following process happens:

```
Discord Gateway

        |

        v

Discord Client

        |

        v

Event Handler

        |

        v

Event Execute Function

        |

        v

Application Logic
```

---

## Event Loading

Events are loaded dynamically during application startup.

The event loader:

- Finds event files
- Registers events with the Discord client
- Connects handlers automatically

This keeps the main application file clean and allows new events
to be added easily.

---

## Current Events

## ready

The `ready` event runs when the bot successfully connects to Discord.

Common uses:

- Confirm successful startup
- Initialize services
- Display bot status

Example:

```
Bot is online
```

---

## interactionCreate

The `interactionCreate` event handles interactions from Discord.

Currently used for:

- Slash command execution
- Processing user interactions

Flow:

```
User executes command

        |

        v

interactionCreate Event

        |

        v

Command Handler

        |

        v

Command Execution
```

---

## Adding a New Event

To add a new event:

1. Create a new file inside:

```
src/events/
```

Example:

```
src/events/messageCreate.ts
```

2. Define the event name.

3. Add the execution logic.

Example:

```ts
export default {
    name: "eventName",

    async execute(...args) {
        // event logic
    }
}
```

---

## Best Practices

When creating events:

- Keep event logic separated
- Avoid large event files
- Use services for complex operations
- Handle errors properly
- Keep handlers focused on one responsibility

---

## Future Improvements

Possible event system improvements:

- Event priority system
- Better error handling
- Event monitoring
- Performance tracking
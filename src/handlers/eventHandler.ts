import { EventValidator } from "../validators/index.js";

import { Client } from "discord.js";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { events } from "../collections/events.js";
import type { Event } from "../interfaces/Event.js";
import logger from "../logger/logger.js";

async function importEvent(filePath: string): Promise<Event> {
    const module = await import(pathToFileURL(filePath).href);

    return module.default;
}

function registerEvent(client: Client, event: Event): void {
    events.set(event.name, event);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }

    logger.info("EventHandler", `Loaded event: ${event.name}`);
}

export async function loadEvents(client: Client) {
    const eventsPath = path.join(process.cwd(), "src", "events");

    const files = (await readdir(eventsPath)).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of files) {
        const filePath = path.join(eventsPath, file);

        const event = await importEvent(filePath);

        EventValidator.validate(event, filePath);

        registerEvent(client, event);
    }

    logger.info("EventHandler", `Loaded ${events.size} event(s).`);
}

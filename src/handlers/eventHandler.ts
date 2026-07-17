import { Client } from "discord.js";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { events } from "../collections/events.js";
import type { Event } from "../interfaces/Event.js";

export async function loadEvents(client: Client) {
    const eventsPath = path.join(process.cwd(), "src", "events");

    const files = await readdir(eventsPath);

    for (const file of files) {
        if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

        const filePath = path.join(eventsPath, file);

        const module = await import(pathToFileURL(filePath).href);

        const event: Event = module.default;

        events.set(event.name, event);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }

        console.log(`✅ Loaded event: ${event.name}`);
    }
}
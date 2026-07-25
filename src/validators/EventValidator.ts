import type { Event } from "../interfaces/Event.js";
import { EventLoadError } from "../errors/index.js";

export class EventValidator {
    public static validate(event: unknown, file: string): asserts event is Event {
        if (!event) {
            throw new EventLoadError(`Event export is missing. File: ${file}`);
        }

        if (typeof event !== "object") {
            throw new EventLoadError(`Event must be an object. File: ${file}`);
        }

        if (!("name" in event)) {
            throw new EventLoadError(`Event name is missing. File: ${file}`);
        }

        if (!("execute" in event)) {
            throw new EventLoadError(`Event execute is missing. File: ${file}`);
        }

        if (typeof (event as Event).execute !== "function") {
            throw new EventLoadError(`Event execute must be a function. File: ${file}`);
        }
    }
}

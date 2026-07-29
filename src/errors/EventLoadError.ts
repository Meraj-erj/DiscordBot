import { FrameworkError } from "./FrameworkError.js";

export class EventLoadError extends FrameworkError {
    constructor(message: string) {
        super({
            code: "EVENT_LOAD_ERROR",
            message,
        });
    }
}

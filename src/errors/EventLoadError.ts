import { BaseError } from "./BaseError.js";

export class EventLoadError extends BaseError {
    constructor(message: string) {
        super("EVENT_LOAD_ERROR", message);
    }
}

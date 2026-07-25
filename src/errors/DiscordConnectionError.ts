import { FrameworkError } from "./FrameworkError.js";
import { ErrorCodes } from "./ErrorCodes.js";

export class DiscordConnectionError extends FrameworkError {
    constructor(message: string, file?: string, line?: number, hint?: string, cause?: Error) {
        super({
            code: ErrorCodes.DISCORD_CONNECTION_ERROR,

            message,

            file,

            line,

            hint,

            cause,
        });
    }
}

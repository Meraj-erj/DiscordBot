import { FrameworkError } from "./FrameworkError.js";
import { ErrorCodes } from "./ErrorCodes.js";

export class ConfigurationError extends FrameworkError {
    constructor(message: string, file?: string, line?: number, hint?: string, cause?: Error) {
        super({
            code: ErrorCodes.CONFIG_INVALID,

            message,

            file,

            line,

            hint,

            cause,
        });
    }
}

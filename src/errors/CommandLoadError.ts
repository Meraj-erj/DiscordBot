import { FrameworkError } from "./FrameworkError.js";
import { ErrorCodes } from "./ErrorCodes.js";

export class CommandLoadError extends FrameworkError {
    constructor(message: string, file?: string, line?: number, hint?: string, cause?: Error) {
        super({
            code: ErrorCodes.COMMAND_LOAD_ERROR,

            message,

            file,

            line,

            hint,

            cause,
        });
    }
}

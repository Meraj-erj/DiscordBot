import { FrameworkError } from "./FrameworkError.js";
import { ErrorCodes } from "./ErrorCodes.js";

export class ContainerError extends FrameworkError {
    constructor(message: string, file?: string, line?: number, hint?: string, cause?: Error) {
        super({
            code: ErrorCodes.CONTAINER_ERROR,

            message,

            file,

            line,

            hint,

            cause,
        });
    }
}

import { FrameworkError } from "./FrameworkError.js";
import { ErrorCodes } from "./ErrorCodes.js";

export class ProxyError extends FrameworkError {
    constructor(message: string, file?: string, line?: number, hint?: string, cause?: Error) {
        super({
            code: ErrorCodes.PROXY_ERROR,

            message,

            file,

            line,

            hint,

            cause,
        });
    }
}

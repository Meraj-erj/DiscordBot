export interface FrameworkErrorOptions {

    code: string;

    name?: string;

    message: string;

    file?: string;

    line?: number;

    hint?: string;

    cause?: Error;

}

export class FrameworkError extends Error {

    public readonly code: string;

    public readonly file?: string;

    public readonly line?: number;

    public readonly hint?: string;

    public readonly cause?: Error;

    constructor(options: FrameworkErrorOptions) {

        super(options.message);

        this.name = options.name ?? new.target.name;

        this.code = options.code;

        this.file = options.file;

        this.line = options.line;

        this.hint = options.hint;

        this.cause = options.cause;

        Error.captureStackTrace?.(
            this,
            new.target
        );
    }

}
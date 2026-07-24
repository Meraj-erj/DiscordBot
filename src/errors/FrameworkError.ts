export interface FrameworkErrorOptions {
    code: string;
    message: string;

    name?: string | undefined;
    file?: string | undefined;
    line?: number | undefined;
    hint?: string | undefined;
    cause?: Error | undefined;
}

export class FrameworkError extends Error {
    public readonly code: string;

    public readonly file: string | undefined;
    public readonly line: number | undefined;
    public readonly hint: string | undefined;

    public override readonly cause: Error | undefined;

    public constructor(options: FrameworkErrorOptions) {
        super(options.message);

        this.name = options.name ?? new.target.name;

        this.code = options.code;
        this.file = options.file;
        this.line = options.line;
        this.hint = options.hint;
        this.cause = options.cause;

        Error.captureStackTrace?.(this, new.target);
    }
}
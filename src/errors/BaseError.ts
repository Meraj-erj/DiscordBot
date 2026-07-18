export abstract class BaseError extends Error {
    public readonly timestamp: Date;
    public readonly code: string;

    protected constructor(
        code: string,
        message: string
    ) {
        super(message);

        this.name = this.constructor.name;
        this.code = code;
        this.timestamp = new Date();

        Error.captureStackTrace?.(
            this,
            this.constructor
        );
    }
}
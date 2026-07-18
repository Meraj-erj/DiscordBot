import { FrameworkError } from "./FrameworkError.js";

export class ErrorFactory {

    public static create(error: unknown): FrameworkError {

        if (error instanceof FrameworkError) {

            return error;

        }

        if (error instanceof Error) {

            return new FrameworkError({

                code: "JS-0001",

                name: error.name,

                message: error.message,

                cause: error,

            });

        }

        return new FrameworkError({

            code: "UNKNOWN",

            message: String(error),

        });

    }

}
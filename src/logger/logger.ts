import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = winston.format.printf((info) => {
    const timestamp = info.timestamp;

    const level = info.level.toUpperCase();

    const context = info.context ?? "App";

    const message = info.message;

    return `${timestamp} [${level}] [${context}] ${message}`;
});

const logger = winston.createLogger({
    level: "debug",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),

        logFormat
    ),

    transports: [
        new winston.transports.Console(),

        new DailyRotateFile({
            dirname: "logs",

            filename: "%DATE%.log",

            datePattern: "YYYY-MM-DD",

            maxFiles: "30d",
        }),
    ],
});

class Logger {
    public info(context: string, message: string): void {
        logger.info(
            message,

            {
                context,
            }
        );
    }

    public warn(context: string, message: string): void {
        logger.warn(
            message,

            {
                context,
            }
        );
    }

    public error(context: string, message: string): void {
        logger.error(
            message,

            {
                context,
            }
        );
    }

    public debug(context: string, message: string): void {
        logger.debug(
            message,

            {
                context,
            }
        );
    }
}

export default new Logger();

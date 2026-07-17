import fs from "node:fs";
import path from "node:path";

import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logsDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
);

const logger = winston.createLogger({
    level: "debug",

    format: logFormat,

    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                }),
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}] ${message}`;
                })
            ),
        }),

        new DailyRotateFile({
            filename: "logs/app-%DATE%.log",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
        }),

        new DailyRotateFile({
            filename: "logs/error-%DATE%.log",
            level: "error",
            datePattern: "YYYY-MM-DD",
            maxFiles: "30d",
        }),

        new DailyRotateFile({
            filename: "logs/debug-%DATE%.log",
            level: "debug",
            datePattern: "YYYY-MM-DD",
            maxFiles: "7d",
        }),
    ],
});

export default logger;
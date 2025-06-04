import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "info.log", level: "info" }),
        new transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: "HH:mm:ss" }),
                logFormat
            ),
        }),
    ],
});

export default logger;

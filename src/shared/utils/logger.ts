import { createLogger, format, transports } from "winston";
import { env } from "./env.js";

type LogLevels = typeof env.LOG_LEVEL;

const customLevels: {
    levels: { [key in LogLevels]: number },
    colors: { [key in LogLevels]: string }
} = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,
    },
    colors: {
        fatal: "red",
        error: "red",
        warn: "yellow",
        info: "green",
        debug: "blue",
        trace: "gray",
    },
};

const filterNonErrors = format((info) => {
    if (info.level === "error" || info.level === "fatal") {
        return false;
    }
    return info;
});

const filterErrorsAndFatal = format((info) => {
    if (info.level === "error" || info.level === "fatal") {
        return info;
    }
    return false;
});
    
const colorizeFormat = () => {
    if (env.NODE_ENV === "development") {
        return format.colorize({
            colors: customLevels.colors,
        });
    }
    return format.uncolorize();
}

const winstonLogger = createLogger({
    levels: customLevels.levels,
    level: env.LOG_LEVEL,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
        colorizeFormat(),
        format.printf(({level, message, timestamp, error}) => {
            return `[${timestamp}] ${level}: ${message} - ${error ? `\n${(error as Error).stack}` : ""}`;
        })
    ),
    transports: [
        new transports.Console({
            format: format.combine(filterNonErrors()),
        }),
        new transports.Console({
            format: format.combine(filterErrorsAndFatal()),
            stderrLevels: ["error", "fatal"],
        }),
    ],
});

interface LoggerParams {
    service: (typeof env)["LOG_SERVICES"][0]
    level: (typeof env)["LOG_LEVEL"]
    message: string
    queueId?: string
    error?: unknown;
    data?: unknown;
}

export const logger = ({
    service,
    level,
    message,
    queueId,
    error,
    data,
}: LoggerParams) => {
    if (!env.LOG_SERVICES.includes(service)) {
        return;
    }
    let prefix = `[${service.charAt(0).toUpperCase() + service.slice(1)}]`;
    if (queueId) {
        prefix += `[Transaction] [${queueId}]`;
    }

    let suffix = "";
    if (data){
        suffix += ` - ${JSON.stringify(data)}`;
    }
    
    if (error){
        winstonLogger.error(level, `${prefix} ${message}${suffix}`, {error});
    } else {
        winstonLogger.log(level, `${prefix} ${message}${suffix}`);
    }
}
import { LogLevel } from "../../types/LoggerInterface/logLevel";
import { LogMeta } from "../../types/LoggerInterface/logMeta";
import { Logger } from "../../types/LoggerInterface/logger";

function writeLog(level: LogLevel, message: string, meta: LogMeta){
    const logEntry = {
        timeStammp: new Date().toISOString(),
        level,
        message,
        ...meta
    }

    const serialized = JSON.stringify(logEntry);

    if(level === "error"){
        process.stderr.write(serialized + "\n");
    }
    else{
        process.stdout.write(serialized + "\n");
    }
}

export const stdLogger: Logger = {
    debug: (message, meta) => writeLog("debug", message, meta),
    info: (message, meta) => writeLog("info", message, meta),
    warn: (message, meta) => writeLog("warn", message, meta),
    error: (message, meta) => writeLog("error", message, meta)
}
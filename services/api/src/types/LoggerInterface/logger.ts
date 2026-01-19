import { LogMeta } from "./logMeta";

export interface Logger {
    debug(message: string, meta: LogMeta): void;
    info(message: string, meta: LogMeta): void;
    warn(message: string, meta: LogMeta): void;
    error(message: string, meta: LogMeta): void;
}
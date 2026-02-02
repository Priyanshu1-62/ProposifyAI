export interface LogMeta {
    requestId?: string;
    service?: string;
    operation?: string;
    attempt?: number;
    model?: string;
    errorType?: string;
    details?: Record<string, unknown>;
    error?: {
        name?: string;
        message?: string;
        stack?: string;
        code?: string | number;
    };
}
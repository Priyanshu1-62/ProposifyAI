import { EmailEventType, OutboundEmailStatus } from "@prisma/client";

export const resendEventTypeMap: Record<string, OutboundEmailStatus> = {
    "email.sent": "SENT",
    "email.delivered": "DELIVERED",
    "email.bounced": "BOUNCED",
    "email.failed": "FAILED",
    "email.conplained": "COMPLAINED",
}
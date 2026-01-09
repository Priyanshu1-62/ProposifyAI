import { EmailEventType } from "@prisma/client";

export const resendEventTypeMap: Record<string, EmailEventType> = {
    "email.sent": "SENT",
    "email.delivered": "DELIVERED",
    "email.clicked": "CLICKED",
    "email.opened": "OPENED",
    "email.bounced": "BOUNCED",
    "email.failed": "FAILED",
    "email.conplained": "COMPLAINED",
}
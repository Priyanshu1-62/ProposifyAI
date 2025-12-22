import { EmailEventType } from "@prisma/client";

export interface outboundEmailEventBody {
    eventType: EmailEventType;
    occurredAt: Date;
    outboundEmailId: string;
}
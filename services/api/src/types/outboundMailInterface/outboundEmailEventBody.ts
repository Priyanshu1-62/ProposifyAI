import { OutboundEmailStatus } from "@prisma/client";

export interface outboundEmailEventBody {
    eventType: OutboundEmailStatus;
    occurredAt: Date;
    outboundEmailId: string;
}
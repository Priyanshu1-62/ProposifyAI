import { OutboundEmailAttemptStatus, OutboundEmailFailureReason } from "@prisma/client";

export interface outboundAttemptUpdateBody {
    outboundEmailId?: string;
    status: OutboundEmailAttemptStatus;
    failureReason?: OutboundEmailFailureReason
}
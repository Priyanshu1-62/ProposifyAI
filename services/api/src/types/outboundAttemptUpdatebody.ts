import { OutboundEmailAttemptStatus, OutboundEmailFailureReason } from "../generated/prisma";

export interface outboundAttemptUpdateBody {
    outboundEmailId?: string;
    status: OutboundEmailAttemptStatus;
    failureReason?: OutboundEmailFailureReason;
}
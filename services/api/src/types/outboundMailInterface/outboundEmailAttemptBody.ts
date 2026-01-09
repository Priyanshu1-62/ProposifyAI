import { OutboundEmailAttemptStatus, OutboundEmailFailureReason } from "@prisma/client";

export interface outboundEmailAttemptBody {
    fromEmail: string;
    toEmail: string;
    subject: string;
    userId: string;
    requestId: string;
    respondentGroupId: string;
    status: OutboundEmailAttemptStatus;
    failureReason?: OutboundEmailFailureReason;
    resendMessageId?: string;
}
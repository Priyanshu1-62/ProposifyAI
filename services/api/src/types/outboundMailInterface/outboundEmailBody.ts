import { OutboundEmailStatus } from "@prisma/client";

export interface outboundEmailBody {
    resendMessageId: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    status: OutboundEmailStatus
    current_status: OutboundEmailStatus
    userId: string;
    requestId: string;
    respondentGroupId: string;
}
export interface outboundEmailBody {
    resendMessageId: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    userId: string;
    requestId: string;
    respondentGroupId: string;
}
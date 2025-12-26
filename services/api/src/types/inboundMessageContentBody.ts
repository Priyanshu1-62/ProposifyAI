export interface inboundMessageContentBody {
    subject?: string;
    text: string;
    html: string;
    inboundMessageId: string;
}
export interface mailgunInboundPayload {
    recipient: string;
    sender: string;
    subject: string;
    "body-plain"?: string;
    "body-html"?: string;
    attachments?: any[];
}
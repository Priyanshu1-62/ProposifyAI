export interface bulkEmailPayload {
    from: string;
    to: string;
    bcc: string[];
    subject: string;
    html: string;
}
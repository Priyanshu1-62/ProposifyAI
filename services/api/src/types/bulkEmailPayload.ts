import type { Tag } from "resend";

export interface bulkEmailPayload {
    from: string;
    to: string;
    bcc: string[];
    subject: string;
    text: string;
    html: string;
    tags: Tag[];
}
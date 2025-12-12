import { mailgunInboundPayload } from "../types/mailginInboundPayload";

function extractRequestId(recipient: string): string | null { 
    try {
        const prefix = recipient.split('@')[0];
        const requestId = prefix.split('+')[1];
        return requestId || null;
    } 
    catch (error) {
        return null;
    }
}

export async function processInboundEmail(payload: mailgunInboundPayload) {
    try {
        const requestId = extractRequestId(payload.recipient);
        const messageData = {
            requestId, 
            from: payload.sender,
            subject: payload.subject,
            text: payload["body-plain"] || "",
            html: payload["body-html"] || "",
            attachments: payload["attachments"] || []
        }
    
        // TODO: Store messageData in DB
    
        return messageData;
    } 
    catch (error) {
        throw error;
    }
}
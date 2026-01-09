import { Resend } from "resend";
import { bulkEmailPayload } from "../../types/mailInterface/bulkEmailPayload";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailResend(payload: bulkEmailPayload) {
    try {
        const outboundResult = await resend.emails.send(payload);
        return outboundResult;
    } 
    catch (error) {
        throw error;
    }
}
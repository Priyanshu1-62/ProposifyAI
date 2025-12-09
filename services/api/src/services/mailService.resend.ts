import { Resend } from "resend";
import { bulkEmailPayload } from "../types/bulkEmailPayload";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBulkEmailResend(data: bulkEmailPayload) {
    try {
        const response = await resend.emails.send(data);
        return response;
    } 
    catch (error) {
        throw error;
    }
}
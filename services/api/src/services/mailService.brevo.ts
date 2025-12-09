import Brevo from "@getbrevo/brevo";
import { bulkEmailPayload } from "../types/bulkEmailPayload";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

export async function sendBulkEmailBrevo(data: bulkEmailPayload) {
    try {
        const mailBody = {
            sender: {email: data.from},
            to: [{email: data.to}],
            bcc: data.bcc.map(email => ({email})),
            subject: data.subject,
            htmlContent: data.html
        };
        const response = await apiInstance.sendTransacEmail(mailBody);
        return response;
    } 
    catch (error) {
        throw error;
    }
}
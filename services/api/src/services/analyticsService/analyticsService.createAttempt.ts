import prisma from "../../lib/prisma";
import { bulkEmailPayload } from "../../types/mailInterface/bulkEmailPayload";
import { outboundEmailAttemptBody } from "../../types/outboundMailInterface/outboundEmailAttemptBody";


export async function createOutboundAttempt(emailPayload: bulkEmailPayload){
    try {
        const tagMap = Object.fromEntries(emailPayload.tags.map(tag => [tag.name, tag.value]));
        const data: outboundEmailAttemptBody = {
            fromEmail: emailPayload.from,
            toEmail: emailPayload.to,
            subject: emailPayload.subject,
            userId: tagMap.userId,
            requestId: tagMap.requestId,
            respondentGroupId: tagMap.respondentGroupId,
            status: "FAILED",
            failureReason: "PROVIDER_ERROR"
        }
        const result = await prisma.outboundEmailAttempt.create({data});
        return result;
    } 
    catch (error) {
        throw error;
    }
}
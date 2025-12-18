import prisma from "../lib/prisma";
import { bulkEmailPayload } from "../types/bulkEmailPayload";
import { outboundEmailBody } from "../types/outboundEmailBody";


export async function createOutboundEntry(emailPayload: bulkEmailPayload, Id: string){
    try {
        const tagMap = Object.fromEntries(emailPayload.tags.map(tag => [tag.name, tag.value]));
        const data: outboundEmailBody = {
            resendMessageId: Id,
            fromEmail: emailPayload.from,
            toEmail: emailPayload.to,
            subject: emailPayload.subject,
            status: "SENT",
            userId: tagMap.userId,
            requestId: tagMap.requestId,
            respondentGroupId: tagMap.respondentGroupId
        }
        const outboundEntry = await prisma.outboundEmail.create({data});
        return outboundEntry;
    } 
    catch (error) {
        throw error;    
    }
}
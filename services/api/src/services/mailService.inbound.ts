import prisma from "../lib/prisma";
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
        if(!requestId){
            throw new Error("Invalid inbound email");
        }
        const messageData = {
            requestId, 
            from: payload.sender,
            subject: payload.subject,
            text: payload["body-plain"] || "",
            html: payload["body-html"] || "",
            attachments: payload["attachments"] || []
        }
        const existingRespondent = await prisma.respondentMessage.findFirst({where: {from: messageData.from, requestId}});
        if(existingRespondent){
            return {ignored: true};
        }

        const recipientMessageData = {
            from: messageData.from,
            requestId
        }
        const result1 = await prisma.respondentMessage.create({data: recipientMessageData});

        const inboundMessageData = {
            subject: messageData.subject,
            text: messageData.text,
            html: messageData.html,
            respondentMessageId: result1.id
        }
        const result2 = await prisma.inboundMessage.create({data: inboundMessageData});
    
        await Promise.all(  //Hmmm
            messageData.attachments.map(async (attacment)=>{
                const attachmentData = {
                    fileName: attacment.name || null,
                    contentType: attacment["content-type"] || null,
                    size: attacment.size || null,
                    url: attacment.url || null,
                    inboundMessageId: result2.id
                }
                return await prisma.attachment.create({data: attachmentData});
            })
        );
        return messageData;
    } 
    catch (error) {
        throw error;
    }
}
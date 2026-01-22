import prisma from "../../lib/prisma";
import { inboundAttachmnt } from "../../types/inboundMailInterace/inboundAttachmentBody";


export async function createInboundAttachment(attachment: inboundAttachmnt, inboundMessageId: string) {
    try {
        const inboundAttachment = await prisma.inboundMessageAttachment.create({data: {...attachment, inboundMessageId}});
        return inboundAttachment;
    }
    catch (error) {
        throw error;
    }
}
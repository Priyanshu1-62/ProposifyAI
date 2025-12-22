import prisma from "../lib/prisma";


export async function createInboundMessage(from: string, messageId: string, requestId: string) {
    try {
        const inboundMessage = await prisma.inboundMessage.create({data: {from, messageId, requestId}});
        return inboundMessage;
    }
    catch (error) {
        throw error;
    }
}
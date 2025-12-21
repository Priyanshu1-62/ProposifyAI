import prisma from "../lib/prisma";
import { inboundMessageContentBody } from "../types/inboundMessageContentBody";


export async function createInboundContent(data: inboundMessageContentBody) {
    try {
        const inboundMessageContent = await prisma.inboundMessageContent.create({data});
        return inboundMessageContent;
    } 
    catch (error) {
        throw error;    
    }
}
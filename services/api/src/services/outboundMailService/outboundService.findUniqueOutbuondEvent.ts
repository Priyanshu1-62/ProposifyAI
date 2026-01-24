import { OutboundEmailStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function findUniqueOutboundEvent(outboundEmailId: string, eventType: OutboundEmailStatus){
    try {
        const outboundEmailEvent = await prisma.outboundEmailEvent.findUnique({where: {outboundEmailId_eventType:{outboundEmailId, eventType}}});
        return outboundEmailEvent;
    } 
    catch (error) {
        throw error;
    }
}
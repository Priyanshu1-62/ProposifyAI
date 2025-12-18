import prisma from "../lib/prisma";
import { outboundEmailEventBody } from "../types/outboundEmailEventBody";

export async function createOutboundEmailEvent(data: outboundEmailEventBody){
    try {
        const event = await prisma.outboundEmailEvent.create({data});
        return event;
    } 
    catch (error) {
        throw error;
    }
}
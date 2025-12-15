import prisma from "../lib/prisma";
import { outboundAttemptUpdateBody } from "../types/outboundAttemptUpdatebody";


export async function updateOutboundAttempt(id: string, data: outboundAttemptUpdateBody){
    try {
        const result = await prisma.outboundEmailAttempt.update({where: {id}, data})
        return result;
    } 
    catch (error) {
        throw error;    
    }
}
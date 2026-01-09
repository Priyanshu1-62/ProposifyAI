import prisma from "../../lib/prisma";
import { outboundEmailupdateBody } from "../../types/outboundMailInterface/outboundEmailUpdateBody";

export async function updateoutboundEmail(id: string, data: outboundEmailupdateBody){
    try {
        const result = await prisma.outboundEmail.update({where: {id}, data});
        return result;
    } 
    catch (error) {
        throw error;    
    }
}
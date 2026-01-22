import prisma from "../../lib/prisma";
import { inboundMessageGetData } from "../../types/inboundMailInterace/inboundMessageGetData";


export async function getInboundMessage(data: inboundMessageGetData){
    try {
        const inboundMessage = await prisma.inboundMessage.findFirst({where: data});
        return inboundMessage;
    } 
    catch (error) {
        
    }
}
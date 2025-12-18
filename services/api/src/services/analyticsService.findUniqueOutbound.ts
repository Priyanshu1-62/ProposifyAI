import prisma from "../lib/prisma";

export async function findUniqueOutbound(resendMessageId: string){
    try {
        const outboundEmail = await prisma.outboundEmail.findUnique({where: {resendMessageId}});
        return outboundEmail;
    } 
    catch (error) {
        throw error;
    }
}
import prisma from "../../lib/prisma";


export async function getRequest(requestId: string) {
    try {
        const request = await prisma.request.findFirst({where: {id: requestId}});
        return request;
    } 
    catch (error) {
        throw error;    
    }
}
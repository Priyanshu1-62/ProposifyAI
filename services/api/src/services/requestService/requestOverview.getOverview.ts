import prisma from "../../lib/prisma";

export async function getRequestOverview(requestId: string){
    try {
        const requestOverview = await prisma.requestOverview.findFirst({where: {requestId}});
        return requestOverview;
    } 
    catch (error) {
        throw error;
    }
}
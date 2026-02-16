import prisma from "../../lib/prisma";

export async function getRequestOverviews(userId: string){
    try {
        const requestOverviews = await prisma.requestOverview.findMany({where: {userId}});
        return requestOverviews;
    } 
    catch (error) {
        throw error;
    }
}
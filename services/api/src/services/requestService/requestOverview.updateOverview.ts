import prisma from "../../lib/prisma";
import { requestOverviewBody } from "../../types/requestInterface/requestOverviewBody";

export async function updateRequestOverview(requestId: string, data: requestOverviewBody){
    try {
        const requestOverview = await prisma.requestOverview.update({where: {requestId}, data});
        return requestOverview;
    } 
    catch (error) {
        throw error;
    }
}
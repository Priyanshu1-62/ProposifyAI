import { RequestOverviewStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function createRequestOverview(requestId: string, title: string, description: string, respondentGroupId: string, status: RequestOverviewStatus, userId: string){
    try {
        const requestOverview = await prisma.requestOverview.create({data: {requestId, title, description, respondentGroupId, status, userId}});
        return requestOverview;
    } 
    catch (error) {
        throw error;
    }
}
import { RequestOverviewStatus } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function createRequestOverview(requestId: string, respondentGroupId: string, status: RequestOverviewStatus){
    try {
        const requestOverview = await prisma.requestOverview.create({data: {requestId, respondentGroupId, status}});
        return requestOverview;
    } 
    catch (error) {
        throw error;
    }
}
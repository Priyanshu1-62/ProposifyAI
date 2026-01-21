import prisma from "../../lib/prisma";
import { requestOverviewBody } from "../../types/requestInterface/requestOverviewBody";
import { requestOverviewData } from "../../types/requestInterface/requestOverviewData";
import { requestOverviewIncBody } from "../../types/requestInterface/requestOverviewIncBody";
import { typedObjectEntries } from "../../utils/typedObjectEntries";

export async function updateRequestOverview(requestId: string, set: requestOverviewBody, increment: requestOverviewIncBody){
    try {
        const data: requestOverviewData = {};
        if(set){
            Object.assign(data, set);
        }

        if(increment){
            for(const [key, value] of typedObjectEntries(increment)){
                if(value) data[key] = {increment: value};
            }
        }

        const requestOverview = await prisma.requestOverview.update({where: {requestId}, data});
        return requestOverview;
    } 
    catch (error) {
        throw error;
    }
}
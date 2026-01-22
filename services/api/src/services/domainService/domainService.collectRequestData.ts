import { getRequestOverview } from "../requestService/requestOverview.getOverview";
import { getAIRequestProfile } from "../requestService/requestProfile.getAIRequestProfile";
import { getRequest } from "../requestService/requestService.getRequest";

export async function collectRequestData(requestId: string){
    try {
        const request = await getRequest(requestId);
        const aiRequestProfile = await getAIRequestProfile(requestId);
        const requestOverview = await getRequestOverview(requestId);

        const requestAnalysisData = {
            ...request,
            ...aiRequestProfile, 
            ...requestOverview,
            requestId,
            createdAt: request?.createdAt
        };
        return requestAnalysisData;
    } 
    catch (error) {
        throw error;
    }
}
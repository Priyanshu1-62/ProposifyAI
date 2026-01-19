import { Prisma } from "@prisma/client";
import { AIRequestProfileBody } from "../../types/requestInterface/AIRequestProfileBody";
import { createScoringCriteria } from "./domainService.createScoringCriteria";
import { summarizeText } from "./domainService.summarizeText";
import { createAIRequestProfile } from "../requestService/requestService.createAIRequestProfile";
import { updateRequestOverview } from "../requestService/requestOverview.updateOverview";

export async function createRequestProfile(requestId: string, description: string) {
    try {
        const summarizationResult = await summarizeText({text: description});

        const createCriteriaResult = await createScoringCriteria({text: summarizationResult.summary});

        const aiRequestProfileData: AIRequestProfileBody = {
            aiModel: createCriteriaResult.metaData.aiModel,
            promptVersion: createCriteriaResult.metaData.promptVersion,
            aiSummary: summarizationResult.summary,
            scoringCriteria: createCriteriaResult.scoringCriteria as unknown as Prisma.InputJsonValue,
            requestId
        }
        const aiRequestProfile = await createAIRequestProfile(aiRequestProfileData);

        await updateRequestOverview(aiRequestProfile.requestId, {aiRequestProfileId: aiRequestProfile.id, status: "AWAITING_RESPONSES"});

        return aiRequestProfile;
    } 
    catch (error) {
        throw error;    //Log it instead by using logger
    }
}
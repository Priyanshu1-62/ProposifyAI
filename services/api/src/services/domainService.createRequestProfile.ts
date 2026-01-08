import { Prisma } from "@prisma/client";
import { AIRequestProfileBody } from "../types/AIRequestProfileBody";
import { createScoringCriteria } from "./domainService.createScoringCriteria";
import { summarizeText } from "./domainService.summarizeText";
import { createAIRequestProfile } from "./requestService.createAIRequestProfile";

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
        return aiRequestProfile;
    } 
    catch (error) {
        throw error;    //Log it instead by using logger
    }
}
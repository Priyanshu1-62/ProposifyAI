import { Prisma } from "@prisma/client";
import { AIRequestProfileBody } from "../../types/requestInterface/AIRequestProfileBody";
import { createScoringCriteria } from "./domainService.createScoringCriteria";
import { summarizeText } from "./domainService.summarizeText";
import { createAIRequestProfile } from "../requestService/requestService.createAIRequestProfile";
import { updateRequestOverview } from "../requestService/requestOverview.updateOverview";
import { stdLogger as logger } from "../../utils/loggerInfra/logger";

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
        const errorMessage = String(
            error instanceof Error
            ? error.message || error.name
            : error
        );

        logger.warn(`AI request profile enrichment failed, continuing workflow ...`, {
            service: "AI_REQUEST_PROFILE_CREATION",
            errorType: errorMessage
        });
    }
}
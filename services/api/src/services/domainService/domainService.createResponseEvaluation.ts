import { AIResponseEvaluationBody } from "../../types/evaluationInterface/AIResponseEvaluationBody";
import { evaluateTextInputbody } from "../../types/evaluationInterface/evaluateTextInputBody";
import { evaluateText } from "./domainService.evaluateText";
import { summarizeText } from "./domainService.summarizeText";
import { createAIResponseEvaluation } from "../inboundService/inboundService.createAIResponseEvaluation";
import { getAIRequestProfile } from "../requestService/requestService.getAIRequestProfile";
import { Prisma } from "@prisma/client";
import { stdLogger as logger } from "../../utils/loggerInfra/logger";

export async function createResponseEvaluation(messageText: string, aiRequestProfileId: string | null, inboundMessageId: string){
    try {
        if(!aiRequestProfileId){
            return;
        }
        const aiRequestProfile = await getAIRequestProfile(aiRequestProfileId);
        if(!aiRequestProfile){
            return;
        }
        
        const summarizationResult = await summarizeText({text: messageText});

        const evaluationInput: evaluateTextInputbody = {
            requestSummary: aiRequestProfile.aiSummary,
            scoringCriteria: aiRequestProfile.scoringCriteria as Prisma.InputJsonValue,
            responseSummary: summarizationResult.summary
        }
        const evaluationResult = await evaluateText(evaluationInput);

        const aiResponseEvaluationData: AIResponseEvaluationBody = {
            aiSummary: summarizationResult.summary,
            ...evaluationResult,
            inboundMessageId
        };
        const aiResponseEvaluation = await createAIResponseEvaluation(aiResponseEvaluationData);
        return aiResponseEvaluation;
    } 
    catch (error) {
        const errorMessage = String(
            error instanceof Error
            ? error.message || error.name
            : error
        );

        logger.warn(`AI response evaluation failed, continuing workflow ...`, {
            service: "AI_RESPONSE_EVALUATION",
            errorType: errorMessage
        });
    }
}
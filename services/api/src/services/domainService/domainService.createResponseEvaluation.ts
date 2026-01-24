import { AIResponseEvaluationBody } from "../../types/evaluationInterface/AIResponseEvaluationBody";
import { evaluateTextInputbody } from "../../types/evaluationInterface/evaluateTextInputBody";
import { evaluateText } from "./domainService.evaluateText";
import { summarizeText } from "./domainService.summarizeText";
import { createAIResponseEvaluation } from "../inboundMailService/inboundService.createAIResponseEvaluation";
import { getAIRequestProfile } from "../requestService/requestProfile.getAIRequestProfile";
import { Prisma } from "@prisma/client";
import { stdLogger as logger } from "../../utils/loggerInfra/logger";
import { updateRespondent } from "../respondentService/respondentService.updateRespondent";

export async function createResponseEvaluation(fromEmail: string, respondentGroupId: string, messageText: string, requestId: string, inboundMessageId: string){
    try {
        const aiRequestProfile = await getAIRequestProfile(requestId);
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

        await updateRespondent(fromEmail, respondentGroupId, {inboundEvaluationStatus: "SUCCESS"});
        
        return aiResponseEvaluation;
    } 
    catch (error) {
        await updateRespondent(fromEmail, respondentGroupId, {inboundEvaluationStatus: "FAILED"});

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
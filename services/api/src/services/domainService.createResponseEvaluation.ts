import { AIResponseEvaluationBody } from "../types/AIResponseEvaluationBody";
import { evaluateTextInputbody } from "../types/evaluateTextInputBody";
import { evaluateText } from "./domainService.evaluateText";
import { summarizeText } from "./domainService.summarizeText";
import { createAIResponseEvaluation } from "./inboundService.createAIResponseEvaluation";
import { getAIRequestProfile } from "./requestService.getAIRequestProfile";
import { Prisma } from "@prisma/client";

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
        throw error;
    }
}
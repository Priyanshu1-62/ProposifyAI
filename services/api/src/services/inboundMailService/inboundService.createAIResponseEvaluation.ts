import prisma from "../../lib/prisma";
import { AIResponseEvaluationBody } from "../../types/evaluationInterface/AIResponseEvaluationBody";

export async function createAIResponseEvaluation(data: AIResponseEvaluationBody){
    try {
        const aiResponseEvaluation = await prisma.aIResponseEvaluation.create({data});
        return aiResponseEvaluation;
    } 
    catch (error) {
        throw error;
    }
}
import prisma from "../lib/prisma";
import { AIResponseEvaluationBody } from "../types/AIResponseEvaluationBody";

export async function createAIResponseEvaluation(data: AIResponseEvaluationBody){
    try {
        const aiResponseEvaluation = await prisma.aIResponseEvaluation.create({data});
        return aiResponseEvaluation;
    } 
    catch (error) {
        throw error;
    }
}
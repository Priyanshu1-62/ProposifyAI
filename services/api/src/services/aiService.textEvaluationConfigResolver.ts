import { Prisma } from "@prisma/client";
import { AIConfig } from "../types/AIConfig";
import { AI_CONFIG_VARIANTS } from "./ai/ai.config";

export function textEvaluationConfigResolver(text: string, temperature: number, topP: number, outputSchema: Prisma.JsonValue){
    try {
        const config: AIConfig = {
            model: AI_CONFIG_VARIANTS.TEXT_EVALUATION.model,
            temperature,
            topP,
            maxTokens: text.length*2,
            responseFormat: outputSchema
        }
        return config;            
    } 
    catch (error) {
        throw error;
    }
}
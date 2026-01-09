import { Prisma } from "@prisma/client";
import { AIConfig } from "../../../types/aiInterface/AIConfig";
import { AI_CONFIG_VARIANTS } from "./ai.config";

export function scoringCriteriaConfigResolver(text: string, temperature: number, topP: number, outputSchema: Prisma.JsonValue){
    try {
        const config: AIConfig = {
            model: AI_CONFIG_VARIANTS.SCORING_CRITERIA.model,
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
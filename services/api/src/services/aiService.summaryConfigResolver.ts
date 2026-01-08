import { Prisma } from "@prisma/client";
import { AIConfig } from "../types/AIConfig";
import { AI_CONFIG_VARIANTS } from "./ai/ai.config";

export function summaryConfigResolver(text: string, temperature: number, topP: number, outputSchema: Prisma.JsonValue){
    try {

        const config: AIConfig = {
            model: AI_CONFIG_VARIANTS.TEXT_SUMMARY.model,
            temperature,
            topP,
            maxTokens: Math.min(Math.ceil(text.length*0.3), 700),
            responseFormat: outputSchema
        }
        return config;
    } 
    catch (error) {
        throw error;
    }
}
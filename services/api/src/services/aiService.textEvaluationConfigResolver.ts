import { Prisma } from "@prisma/client";
import { AIConfig } from "../types/AIConfig";

export function textEvaluationConfigResolver(text: string, temperature: number, topP: number, outputSchema: Prisma.JsonValue){
    try {
        const config: AIConfig = {
            model: "gpt-4.1-mini",
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
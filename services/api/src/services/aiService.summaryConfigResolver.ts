import { Prisma } from "@prisma/client";
import { AIConfig } from "../types/AIConfig";

export function summaryConfigResolver(text: string, temperature: number, topP: number, outputSchema: Prisma.JsonValue){
    try {
        const config: AIConfig = {
            model: "gpt-4.1-mini",
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
import { AIConfig } from "../../types/aiInterface/AIConfig";
import { handleAiTextAnalysis } from "./aiService.handleAnalysis";

export async function aiTextEvaluation(systemPrompt: string, userPrompt: string, config: AIConfig){
    try {
        const parsedResult = await handleAiTextAnalysis(systemPrompt, userPrompt, config, "TEXT_EVALUATION");
        return parsedResult;
    } 
    catch (error) {
        throw error;    
    }
}
import { AIConfig } from "../../types/aiInterface/AIConfig";
import { handleAiTextAnalysis } from "./aiService.handleAnalysis";

export async function aiCreateScoringCriteria(systemPrompt: string, userPrompt: string, config: AIConfig){
    try {
        const parsedResult = await handleAiTextAnalysis(systemPrompt, userPrompt, config, "SCORING_CRITERIA_CREATION");
        return parsedResult;
    } 
    catch (error) {
        throw error;    
    }
}
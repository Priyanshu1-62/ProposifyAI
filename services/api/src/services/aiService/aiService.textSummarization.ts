import { AIConfig } from "../../types/aiInterface/AIConfig";
import { handleAiTextAnalysis } from "./aiService.handleAnalysis";

export async function aiTextSummarization(systemPrompt: string, userPrompt: string, config: AIConfig){
    try {
        const parsedResult = await handleAiTextAnalysis(systemPrompt, userPrompt, config, "TEXT_SUMMARIZARION");
        return parsedResult;
    } 
    catch (error) {
          throw error;
    }
}
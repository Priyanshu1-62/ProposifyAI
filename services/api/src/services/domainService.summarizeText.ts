import { summarizeTextInputBody } from "../types/summarizeTextInputBody";
import { summarizeTextOutputBody } from "../types/summarizeTextOutputBody";
import { getPromptPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";
import { AIConfig } from "../types/AIConfig";
import { aiTextSummarization } from "./aiService.textSummarization";

export async function summarizeText(input: summarizeTextInputBody): Promise<summarizeTextOutputBody>{
    try {
        const promptProfile = await getPromptPromptProfile("TextSummary", 1);
        if(!promptProfile){
            throw new Error("Unable to fetch Prompt Profile");
        }

        const variables: Record<string, string> = {

        }
        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);

        const config: AIConfig = {
            model: "gpt-4.1-mini",
            temperature: promptProfile.temperature,
            topP: promptProfile.topP,
            maxTokens: Math.min(Math.ceil(input.text.length*0.3), 700),
            responseFormat: promptProfile.outputSchema
        }
        const rawResult = await aiTextSummarization(aiPayload, config);

        // const parsedResult = 
    } 
    catch (error) {
        throw error;    
    }
}
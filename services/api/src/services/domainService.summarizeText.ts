import { summarizeTextInputBody } from "../types/summarizeTextInputBody";
import { summarizeTextOutputBody } from "../types/summarizeTextOutputBody";
import { getPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";
import { aiTextSummarization } from "./aiService.textSummarization";
import { summaryConfigResolver } from "./aiService.summaryConfigResolver";

export async function summarizeText(input: summarizeTextInputBody): Promise<summarizeTextOutputBody>{
    try {
        const promptProfile = await getPromptProfile("TextSummary", 1);
        if(!promptProfile){
            throw new Error("Unable to fetch Prompt Profile for text summarization");
        }

        const variables: Record<string, string> = {
            "TEXT": input.text
        };

        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);
        const config = summaryConfigResolver(input.text, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);
        
        const parsedResult = await aiTextSummarization(promptProfile.systemPrompt, aiPayload, config);

        const finalResult: summarizeTextOutputBody = {
            summary: parsedResult,
            metaData: {
                aiModel: config.model,
                promptVersion: 1,
                temperature: config.temperature
            }
        }
        return finalResult;
    } 
    catch (error) {
        throw error;    
    }
}
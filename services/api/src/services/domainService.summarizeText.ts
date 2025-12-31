import { summarizeTextInputBody } from "../types/summarizeTextInputBody";
import { summarizeTextOutputBody } from "../types/summarizeTextOutputBody";
import { getPromptPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";
import { AIConfig } from "../types/AIConfig";
import { aiTextSummarization } from "./aiService.textSummarization";
import { validateShape } from "../utils/validateShape";
import { summaryConfigResolver } from "./aiService.summaryConfigResolver";
import { coerceTypes } from "../utils/coerceTypes";
import { normalizeOutput } from "../utils/normalizeOutput";

export async function summarizeText(input: summarizeTextInputBody): Promise<summarizeTextOutputBody>{
    try {
        const promptProfile = await getPromptPromptProfile("TextSummary", 1);
        if(!promptProfile){
            throw new Error("Unable to fetch Prompt Profile");
        }

        const variables: Record<string, string> = {

        }
        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);

        const config = summaryConfigResolver(input.text, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);
        const rawResult = await aiTextSummarization(aiPayload, config);

        const ok = validateShape(rawResult, config.responseFormat);
        if(!ok){
            throw new Error("Invalid response from AI service provider");
        }
        
        coerceTypes(rawResult, null, null, promptProfile.outputSchema);

        normalizeOutput(rawResult, promptProfile.outputSchema);

        const finalResult: summarizeTextOutputBody = {
            summary: rawResult,
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
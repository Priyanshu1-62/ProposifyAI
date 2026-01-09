import { scoringCriteraInputBody } from "../../types/scofingCriteriaInterface/scoringCriteraInputBody";
import { scoringCriteraOutputBody } from "../../types/scofingCriteriaInterface/scoringCriteraOutputBody";
import { scoringCriterionBody } from "../../types/scofingCriteriaInterface/scoringCriterionBody";
import { aiCreateScoringCriteria } from "../aiService/aiService.createScoringCriteria";
import { scoringCriteriaConfigResolver } from "../ai/config/scoringCriteriaConfigResolver";
import { getPromptProfile } from "../promptService/promptService.getPromptProfile";
import { promptBuilder } from "../promptService/promptService.promptBuilder";


export async function createScoringCriteria(input: scoringCriteraInputBody): Promise<scoringCriteraOutputBody>{
    try {
        const promptProfile = await getPromptProfile("ScoringCriteria", 1);
        if(!promptProfile){
            throw new Error("Unable to fetch Prompt profile for scoring criteria creation");
        }

        const variables: Record<string, string> = {
            "TEXT": input.text
        }
        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);
        const config = scoringCriteriaConfigResolver(input.text, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);

        const parsedResult = await aiCreateScoringCriteria(promptProfile.systemPrompt, aiPayload, config);

        const finalResult: scoringCriteraOutputBody = {
            scoringCriteria: parsedResult as scoringCriterionBody[],
            metaData: {
                aiModel: config.model,
                promptVersion: 1,
                temperature: config.temperature
            }            
        };
        return finalResult;
    } 
    catch (error) {
        throw error;    
    }
}
import { scoringCriteraInputBody } from "../types/scoringCriteraInputBody";
import { scoringCriteraOutputBody } from "../types/scoringCriteraOutputBody";
import { scoringCriterionBody } from "../types/scoringCriterionBody";
import { coerceTypes } from "../utils/coerceTypes";
import { normalizeOutput } from "../utils/normalizeOutput";
import { validateShape } from "../utils/validateShape";
import { aiCreateScoringCriteria } from "./aiService.createScoringCriteria";
import { scoringCriteriaConfigResolver } from "./aiService.scoringCriteriaConfigResolver";
import { getPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";


export async function createScoringCriteria(input: scoringCriteraInputBody): Promise<scoringCriteraOutputBody>{
    try {
        const promptProfile = await getPromptProfile("ScoringCriteria", 1);
        if(!promptProfile){
            throw new Error("Unable to fetch Prompt profile for scoring criteria creation");
        }

        const variables: Record<string, string> = {

        }
        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);
        const config = scoringCriteriaConfigResolver(input.text, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);

        const rawResult = await aiCreateScoringCriteria(aiPayload, config);

        const ok = validateShape(rawResult, config.responseFormat);
        if(!ok){
            throw new Error("Invalid response from AI scoring criteria creation service");
        }

        coerceTypes(rawResult, null, null, config.responseFormat);
        normalizeOutput(rawResult, config.responseFormat);

        const finalResult: scoringCriteraOutputBody = {
            scoringCriteria: rawResult as scoringCriterionBody[],
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
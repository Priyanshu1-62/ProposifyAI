import { evaluateTextInputbody } from "../types/evaluateTextInputBody";
import { evaluateTextOutputbody } from "../types/evaluateTextOutputBody";
import { coerceTypes } from "../utils/coerceTypes";
import { normalizeOutput } from "../utils/normalizeOutput";
import { validateShape } from "../utils/validateShape";
import { aiTextEvaluation } from "./aiService.textEvaluation";
import { textEvaluationConfigResolver } from "./aiService.textEvaluationConfigResolver";
import { getPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";


export async function evaluateText(input: evaluateTextInputbody): Promise<evaluateTextOutputbody>{
    try {
        const promptProfile = await getPromptProfile("EvaluateText", 1);
        if(!promptProfile){
          throw new Error("Unable to fetch prompt profile for text evaluation");
        }

        const variables: Record<string, string> = {

        };

        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);
        const config = textEvaluationConfigResolver(input.requestSummary, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);

        const rawResult = await aiTextEvaluation(aiPayload, config);

        const ok = validateShape(rawResult, config.responseFormat);
        if(!ok){
          throw new Error("Invalid response from AI text evaluation service");
        }

        coerceTypes(rawResult, null, null, config.responseFormat);
        normalizeOutput(rawResult, config.responseFormat);

        const finalResult: evaluateTextOutputbody = {

        };
        return finalResult;
    } 
    catch (error) {
      throw error;  
    }
}
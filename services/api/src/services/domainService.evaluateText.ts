import { evaluateTextInputbody } from "../types/evaluateTextInputBody";
import { evaluateTextOutputbody } from "../types/evaluateTextOutputBody";
import { evaluateTextRawResultBody } from "../types/evaluateTextRawResultBody";
import { aiTextEvaluation } from "./aiService.textEvaluation";
import { textEvaluationConfigResolver } from "./aiService.textEvaluationConfigResolver";
import { getPromptProfile } from "./promptService.getPromptProfile";
import { promptBuilder } from "./promptService.promptBuilder";


export async function evaluateText(input: evaluateTextInputbody): Promise<evaluateTextOutputbody>{
    try {
        const promptProfile = await getPromptProfile("TextEvaluation", 1);
        if(!promptProfile){
          throw new Error("Unable to fetch prompt profile for text evaluation");
        }

        const variables: Record<string, string> = {
          "SCORING_CRITERIA": JSON.stringify(input.scoringCriteria, null, 2),
          "TEXT": input.responseSummary
        };

        const aiPayload = await promptBuilder(promptProfile.userPromptTemplate, variables);
        const config = textEvaluationConfigResolver(input.requestSummary, promptProfile.temperature, promptProfile.topP, promptProfile.outputSchema);

        const parsedResult = await aiTextEvaluation(promptProfile.systemPrompt, aiPayload, config);

        const finalResult: evaluateTextOutputbody = {
          ...parsedResult as evaluateTextRawResultBody,
          aiModel: config.model,
          promptVersion: 1
        };
        return finalResult;
    } 
    catch (error) {
      throw error;  
    }
}
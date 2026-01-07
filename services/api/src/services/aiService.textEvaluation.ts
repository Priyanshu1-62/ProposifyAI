import { AIConfig } from "../types/AIConfig";
import { validateShape } from "../utils/validateShape";
import { coerceTypes } from "../utils/coerceTypes";
import { normalizeOutput } from "../utils/normalizeOutput";
import { AI_CONFIG_VARIANTS } from "./ai/ai.config";
import { fetchOpenRouterAI } from "./ai/providers/openRouter/openRouter.client";

export async function aiTextEvaluation(systemPrompt: string, userPrompt: string, config: AIConfig){
    try {
        const model = AI_CONFIG_VARIANTS.TEXT_EVALUATION.model;
        const MAX_ATTEMPTS = 2;
        let lastError = "Unknown";
        let result;     
        
        for(let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++){
            result = await fetchOpenRouterAI(systemPrompt, userPrompt, model, config);

            if(result.status !== 200){
                lastError = result.error ?? `HTTP error ${result.status}`;
                continue;
            }

            lastError = "Unknown";
            break;
        }
        
        if(lastError !== "Unknown"){
            throw new Error(lastError);
        }

        if(!result?.content){
            throw new Error("AI returned empty content for text evaluation");
        }

        const parsedResult = JSON.parse(result.content);     
        
        const ok = validateShape(parsedResult, config.responseFormat);
        if(!ok){
            throw new Error("Invalid response from AI text evaluation service");
        }
        
        coerceTypes(parsedResult, null, null, config.responseFormat);
        normalizeOutput(parsedResult, config.responseFormat);        

        return parsedResult;
    } 
    catch (error) {
        throw error;    
    }
}
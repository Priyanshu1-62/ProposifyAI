import { AIConfig } from "../../types/aiInterface/AIConfig";
import { validateShape } from "../../utils/validateShape";
import { coerceTypes } from "../../utils/coerceTypes";
import { normalizeOutput } from "../../utils/normalizeOutput";
import { fetchOpenRouterAI } from "../ai/providers/openRouter/openRouter.client";
import { stdLogger as logger } from "../../utils/loggerInfra/logger";

export async function handleAiTextAnalysis(systemPrompt: string, userPrompt: string, config: AIConfig, serviceContext: string){
    try {
        const MAX_ATTEMPTS = 2;
        let lastError = "Unknown";
        let result: any;
        let parsedResult;

        for(let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++){

            logger.info(`Calling AI ${serviceContext} service`, {
                service: serviceContext,
                attempt,
                model: config.model
            });

            result = await fetchOpenRouterAI(systemPrompt, userPrompt, config.model, config);

            if(result.status !== 200){
                lastError = result.error ?? `HTTP error ${result.status}`;

                logger.warn(`${serviceContext} attempt failed. Retrying ...`, {
                    service: serviceContext,
                    attempt,
                    model: config.model,
                    errorType: lastError,
                    details: {status: result.status}
                });

                continue;
            }

            lastError = "Unknown";
            break;
        }

        if(lastError !== "Unknown"){

            logger.error(`${serviceContext} service failed.`, {
                service: serviceContext,
                model: config.model,
                errorType: lastError
            });

            throw new Error(lastError);
        }

        if(!result?.content){

            logger.error(`AI returned empty content for ${serviceContext}`, {
                service: serviceContext,
                model: config.model,
                errorType: "AI_EMPTY_RESPONSE"
            });

            throw new Error(`AI returned empty content for ${serviceContext}`);
        }

        try {
            parsedResult = JSON.parse(result.content);
        } 
        catch (err) {
            logger.error(`Failed to parse AI response for ${serviceContext}`, {
                service: serviceContext,
                model: config.model,
                errorType: "AI_JSON_PARSE_ERROR"
            });      
            
            throw new Error(`Invalid response from AI ${serviceContext} service`);
        }

        const ok = validateShape(parsedResult, config.responseFormat);
        if(!ok){

            logger.error(`Invalid response from AI ${serviceContext} service`, {
                service: serviceContext,
                model: config.model,
                errorType: "AI_RESPONSE_SCHEMA_MISMATCH"
            });

            throw new Error(`Invalid response from AI ${serviceContext} service`);
        }
        
        coerceTypes(parsedResult, null, null, config.responseFormat);
        normalizeOutput(parsedResult, config.responseFormat);      
        
        logger.info(`AI ${serviceContext} completed successfully.`, {
            service: serviceContext,
            model: config.model
        });        

        return parsedResult;
    } 
    catch (error) {

        logger.error(`AI ${serviceContext} pipeline failed`, {
            service: serviceContext,
            model: config.model,
            errorType: "AI_PIPELINE_FAILURE"
        });

        throw error;    
    }
}
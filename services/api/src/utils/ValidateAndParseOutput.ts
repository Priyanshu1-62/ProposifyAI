import { Prisma } from "@prisma/client";
import { stringify } from "querystring";

export async function validateAndParseOutput(rawResult: any, responseFormat: Prisma.JsonValue){
    try {
        if(typeof rawResult === "string"){
            rawResult = JSON.parse(rawResult);
        }
        if(typeof rawResult !== "object"){
            throw new Error("Invalid output by AI service provider");
        }

        const expectedSchema = JSON.parse(JSON.stringify(responseFormat));

        if(!rawResult[expectedSchema[0]]){
            
        }


    } 
    catch (error) {
        throw error;    
    }
}
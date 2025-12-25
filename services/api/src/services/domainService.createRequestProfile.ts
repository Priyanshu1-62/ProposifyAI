import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { AIRequestProfileBody } from "../types/AIRequuestProfileBody";
import { createScoringCriteria } from "./domainService.createScoringCriteria";
import { summarizeText } from "./domainService.summarizeText";


export async function createRequestProfile(requestId: string, description: string) {
    try {
        const summarizationResult = await summarizeText({text: description});

        const createCriteriaResult = await createScoringCriteria({text: summarizationResult.summary});

        const aiRequestProfileData: AIRequestProfileBody = {
            aiModel: createCriteriaResult.metadata.aiModel,
            promptVersion: createCriteriaResult.metadata.promptVersion,
            aiSummary: summarizationResult.summary,
            scoringCriteria: createCriteriaResult.scoringCriteria as unknown as Prisma.InputJsonValue,
            requestId
        }
        const aiRequestProfile = await prisma.aIRequestProfile.create({data: aiRequestProfileData});
    } 
    catch (error) {
        throw error;    
    }
}
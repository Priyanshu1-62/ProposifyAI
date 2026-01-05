import { Prisma } from "@prisma/client";
import { AIMetadata } from "./AIMetadata";

export interface evaluateTextOutputbody {
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue
    confidence: number;
    scoringExplanation: string;
    aiModel: string;
    promptVersion: number;
}
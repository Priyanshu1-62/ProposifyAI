import { Prisma } from "@prisma/client";
import { AIMetadata } from "./AIMetadata";

export interface evaluateTextOutputbody {
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue
    confidence: number;
    aiExplanation: string;
    aiModel: string;
    promptVersion: string;
}
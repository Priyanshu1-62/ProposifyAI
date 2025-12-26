import { Prisma } from "@prisma/client";

export interface AIResponseEvaluationBody {
    aiModel: string;
    promptVersion: string;
    aiSummary: string;
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue;
    confidence: number;
    aiExplanation: string;
    inboundMessageId: string;
}
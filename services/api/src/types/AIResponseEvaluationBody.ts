import { Prisma } from "@prisma/client";

export interface AIResponseEvaluationBody {
    aiModel: string;
    promptVersion: number;
    aiSummary: string;
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue;
    confidence: number;
    scoringExplanation: string;
    inboundMessageId: string;
}
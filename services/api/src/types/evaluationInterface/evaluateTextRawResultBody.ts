import { Prisma } from "@prisma/client";

export interface evaluateTextRawResultBody {
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue;
    confidence: number;
    scoringExplanation: string;
}
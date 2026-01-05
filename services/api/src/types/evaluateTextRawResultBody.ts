import { Prisma } from "@prisma/client";
import { scoreBreakdonwbody } from "./scoreBreakdownBody";

export interface evaluateTextRawResultBody {
    overallScore: number;
    scoreBreakdown: Prisma.InputJsonValue;
    confidence: number;
    scoringExplanation: string;
}
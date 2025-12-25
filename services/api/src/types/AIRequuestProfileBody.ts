import { Prisma } from "@prisma/client";
import { scoreBreakdonwbody } from "./scoreBreakdownBody";
import { scoringCriterionBody } from "./scoringCriterionBody";

export interface AIRequestProfileBody {
    aiModel: string;
    promptVersion: string;
    aiSummary: string;
    scoringCriteria: Prisma.InputJsonValue;
    requestId: string;
}
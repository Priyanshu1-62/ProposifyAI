import { Prisma } from "@prisma/client";

export interface evaluateTextInputbody {
    requestSummary: string;
    scoringCriteria: Prisma.InputJsonValue;
    responseSummary: string;
}
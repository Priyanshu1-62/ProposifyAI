import { Prisma } from "@prisma/client";

export interface AIRequestProfileBody {
    aiModel: string;
    promptVersion: string;
    aiSummary: string;
    scoringCriteria: Prisma.InputJsonValue;
    requestId: string;
}
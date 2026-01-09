import { Prisma } from "@prisma/client";

export interface AIRequestProfileBody {
    aiModel: string;
    promptVersion: number;
    aiSummary: string;
    scoringCriteria: Prisma.InputJsonValue;
    requestId: string;
}
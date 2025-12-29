import { Prisma } from "@prisma/client";

export interface AIConfig {
    model: string;
    temperature: number;
    topP: number;
    maxTokens: number;
    responseFormat: Prisma.JsonValue
}
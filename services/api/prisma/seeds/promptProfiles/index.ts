import { PrismaClient } from "@prisma/client";

import { textSummarizationPromptProfileV1 } from "./textSummarization";
import { scoringCriteraPromptProfileV1 } from "./scoringCriteria";
import { textEvaluationPromptProfileV1 } from "./textEvaluation";

const prisma = new PrismaClient();

const promptProfiles = [
    textSummarizationPromptProfileV1,
    scoringCriteraPromptProfileV1,
    textEvaluationPromptProfileV1
];

export async function upsertPromptProfiles(){
    for(const profile of promptProfiles){
        await prisma.promptProfile.upsert({
            where: {key_version: {key: profile.key, version: profile.version}},
            update: {},
            create: {...profile}
        });
    }
}
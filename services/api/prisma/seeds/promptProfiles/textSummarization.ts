import { systemPromptV1, userPromptTemplateV1 } from "../../../src/shared/prompts/textSummarization";

export const textSummarizationPromptProfileV1 = {
    key: "TextSummary",
    version: 1,
    purpose: "Summerize the given text",
    systemPrompt: systemPromptV1,
    userPromptTemplate: userPromptTemplateV1,
    outputSchema: {
        type: "object",
        required: ["summary"],
        properties: {
            summary: { type: "string"}
        }
    },
    temperature: 0.2,
    topP: 0.9
};
export const textSummaryV1 = {
    key: "TextSummary",
    version: 1,
    purpose: "Summerize the given text",
    prompt: "",
    userPromptTemplate: "",
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
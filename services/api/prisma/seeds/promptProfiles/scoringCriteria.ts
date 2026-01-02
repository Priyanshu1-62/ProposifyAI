export const scoringCriteraV1 = {
    key: "ScoringCriteria",
    version: 1,
    purpose: "Create scoring criteria based on given requirement text for evaluation of proposals",
    prompt: "",
    userPromptTemplate: "",
    outputSchema: {
        type: "object",
        required: ["criteria"],
        properties: {
            criteria: {
                type: "array",
                items: {
                    type: "object",
                    required: ["id", "description", "weight"],
                    properties: {
                        id: {type: "string"},
                        description: {type: "string"},
                        weight: {type: "number", minimum: 0, maximum: 1}
                    }
                },
                constraints: {
                    sum: {
                        field: "weight", 
                        equals: 1,
                        description: "sum of weights of all criteria items must be equal to 1"
                    },
                    unique: {
                        field: "id",
                        description: "Each criteria item must have unique id"
                    }
                }                
            }
        }
    },
    temperature: 0.4,
    topP: 0.9
};
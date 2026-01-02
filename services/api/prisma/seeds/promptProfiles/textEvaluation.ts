export const textEvaluationV1 = {
    key: "TextEvaluation",
    version: 1,
    purpose: "Evaluate the input text based on provided scoring criteria and create the required scoring parameters",
    prompt: "",
    userPromptTemplate: "",
    outputSchema: {
        type: "object",
        required: ["scoreBreakdown", "overallScore", "confidence", "scoringExplanation"],
        properties: {
            scoreBreakdown: {
                type: "array",
                items: {
                    type: "object",
                    required: ["id", "score", "notes"],
                    properties: {
                        id: {type: "string"},
                        score: {type: "number", minimum: 0},
                        notes: {type: "string"}
                    }
                },
                constraints: {
                    oneToOneWith: {
                        reference: "ScoringCriteria.criteria",
                        matchField: "id",
                        description: "Each scoreBreakdown item must correspond to exactly one scoringCriteria.criteria item"
                    },
                    lessThanOrEqualToReference: {
                        field: "score",
                        reference: "ScoringCriteria.criteria.weight",
                        matchOn: "weight",
                        description: "score for a criterion must not exceed its assigned weight"
                    }
                }
            }, 
            overallScore: {type: "number"},
            confidence: {
                type: "number",
                minimum: 0,
                maximum: 1,
                description: "AI model's confidence in the correctness, fairness and certainty of the evaluation"
            },
            scoringExplanation: {
                type: "string",
                description: "A cohesive explanation that justifies each criteria's evaluation and summerizes key strength and weakness"
            }
        },
        constraints: {
            aggregate: {
                targetField: "overallScore",
                source: {
                    array: "scoreBreakdown",
                    field: "score"
                },
                operation: "sum",
                equals: true,
                description: "overallScore must be equal to the sum of scores of all items in scoreBreakdown array"
            }
        }
    },
    temperature: 0.2,
    topP: 0.9
};
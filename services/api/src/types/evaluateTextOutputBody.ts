import { AIMetadata } from "./AIMetadata";
import { scoreBreakdonwbody } from "./scoreBreakdownBody";

export interface evaluateTextOutputbody {
    overallScore: number;
    scoreBreakdown: scoreBreakdonwbody[];
    confidence: number;
    explanation: string;
    metaData: AIMetadata;
}
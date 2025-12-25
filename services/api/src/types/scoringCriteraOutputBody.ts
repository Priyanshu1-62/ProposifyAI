import { AIMetadata } from "./AIMetadata";
import { scoringCriterionBody } from "./scoringCriterionBody";

export interface scoringCriteraOutputBody {
    scoringCriteria: scoringCriterionBody[];
    metadata: AIMetadata;
}
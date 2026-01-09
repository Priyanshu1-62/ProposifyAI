import { AIMetadata } from "../aiInterface/AIMetadata";
import { scoringCriterionBody } from "./scoringCriterionBody";

export interface scoringCriteraOutputBody {
    scoringCriteria: scoringCriterionBody[];
    metaData: AIMetadata;
}
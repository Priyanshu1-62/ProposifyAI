import { scoringCriterionBody } from "./scoringCriterionBody";

export interface evaluateTextInputbody {
    requestSummary: string;
    scoringCriteria: scoringCriterionBody[];
    responseSummary: string;
}
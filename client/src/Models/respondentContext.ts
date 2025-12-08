import type { apiResult } from "./apiResult";
import type { respondent } from "./respondent";

export interface respondentModel {
    getRespondentGroup: (id: string) => Promise<apiResult>;
    getRespondentGroups: () => Promise<apiResult>;
    getRespondents: (id: string) => Promise<apiResult>;
    createRespondentGroup: (name: string) => Promise<apiResult>;
    addRespondent: (respondentData: respondent) => Promise<apiResult>
}
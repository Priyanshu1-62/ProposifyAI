import type { apiClientInputBody } from "../../Models/apiClientInputbody";
import type { apiResult } from "../../Models/apiResult";
import type { respondent } from "../../Models/respondent";
import { fetchJsonApiClient } from "../fetchService/fetchJsonApiClient";

export async function addRespondent(body: respondent){
    try {
        const apiURL = import.meta.env.VITE_API_URL;

        const apiInput: apiClientInputBody = {
            resourcePath: `${apiURL}/api/respondents/createRespondent`,
            method: "POST",
            body
        }

        const result = await fetchJsonApiClient(apiInput);
        return result;
    } 
    catch (error) {
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
}
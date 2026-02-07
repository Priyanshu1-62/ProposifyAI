import type { apiClientInputBody } from "../../Models/apiClientInputbody";
import type { apiResult } from "../../Models/apiResult";
import { fetchJsonApiClient } from "../fetchService/fetchJsonApiClient";

export async function getRespondentGroups(){
    try {
        const apiURL = import.meta.env.VITE_API_URL;

        const apiInput: apiClientInputBody = {
            resourcePath: `${apiURL}/api/groups/getGroups`,
            method: "GET",
            body: undefined
        }

        const result = await fetchJsonApiClient(apiInput);
        return result;
    } 
    catch (error) {
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
}
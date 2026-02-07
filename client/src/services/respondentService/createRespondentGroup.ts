import type { apiClientInputBody } from "../../Models/apiClientInputbody";
import type { apiResult } from "../../Models/apiResult";
import { fetchJsonApiClient } from "../fetchService/fetchJsonApiClient";

export async function createRespondentGroup(name: string){
    try {
        const apiURL = import.meta.env.VITE_API_URL;

        const apiInput: apiClientInputBody = {
            resourcePath: `${apiURL}/api/groups/createGroup`,
            method: "POST",
            body: {name}
        }

        const result = await fetchJsonApiClient(apiInput);
        return result;
    } 
    catch (error) {
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
}
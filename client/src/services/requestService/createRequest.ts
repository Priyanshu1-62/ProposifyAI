import type { apiClientInputBody } from "../../Models/apiClientInputbody";
import type { apiResult } from "../../Models/apiResult";
import type { reqData } from "../../Models/reqData";
import { fetchJsonApiClient } from "../fetchService/fetchJsonApiClient";

export async function createRequest(body: reqData){
    try {
        const apiURL = import.meta.env.VITE_API_URL;
        
        const apiInput: apiClientInputBody = {
            resourcePath: `${apiURL}/api/requests/createRequest`,
            method: "POST",
            body,
        }

        const result = await fetchJsonApiClient(apiInput);
        return result;
    } 
    catch (error) {
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
}
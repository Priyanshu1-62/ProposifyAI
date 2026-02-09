import type { apiClientInputBody } from "../../Models/apiClientInputbody";
import type { apiResult } from "../../Models/apiResult";
import { store } from "../../app/store";
import { setLoading } from "../../features/appState/appState.slice";
import { fetchAccessToken } from "../sessionService/fetchAccessToken";
import { refreshAccessToken } from "../sessionService/refreshAccessToken";
import { fetchJsonApiInit } from "./fetchJsonApiInit";

export async function fetchJsonApiClient(apiInput: apiClientInputBody){

    const dispatch = store.dispatch;
    dispatch(setLoading(true));

    try {
        let token = fetchAccessToken();
        let response = await fetch(apiInput.resourcePath, fetchJsonApiInit(apiInput.method, token, apiInput.body));

        if(response.status === 401){
            const refreshResponse = await refreshAccessToken();
            if(!refreshResponse.ok){
                const data = await refreshResponse.json();
                const result: apiResult = {ok: false, status: 401, data}; 
                return result;
            }

            token = fetchAccessToken();
            response = await fetch(apiInput.resourcePath, fetchJsonApiInit(apiInput.method, token, apiInput.body));
        }

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data};
        return result;
    } 
    catch (error) {
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
    finally {
        dispatch(setLoading(false));
    }
}
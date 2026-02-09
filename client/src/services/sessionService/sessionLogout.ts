import type { apiResult } from "../../Models/apiResult";
import { store } from "../../app/store";
import { setLoading } from "../../features/appState/appState.slice";

const apiURL = import.meta.env.VITE_API_URL;

export async function sessionLogout(){

    const dispatch = store.dispatch;
    dispatch(setLoading(true));

    try {
        await fetch(`${apiURL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
    } 
    catch (error) {
        
    }
    finally {
        localStorage.removeItem("accessToken");
        dispatch(setLoading(false));
    }
    
    const result: apiResult = {ok: true, status: 204, data: {}};
    return result;
}
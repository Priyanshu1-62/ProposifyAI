import { store } from "../../app/store";
import { setLoading } from "../../features/appState/appState.slice";

const apiURL = import.meta.env.VITE_API_URL;

export async function refreshAccessToken(){

    const dispatch = store.dispatch;
    dispatch(setLoading(true));

    try {
        const response = await fetch(`${apiURL}/api/auth/token/refresh`, {
            method: "POST",
            credentials: "include"
        });
        if(response.ok){
            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken); 
        }
        return response;
    } 
    catch (error) {
        throw error;
    }
    finally {
        dispatch(setLoading(false));
    }
}
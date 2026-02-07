import type { apiResult } from "../../Models/apiResult";

const apiURL = import.meta.env.VITE_API_URL;

export async function sessionLogout(){
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
    }
    
    const result: apiResult = {ok: true, status: 204, data: {}};
    return result;
}
const apiURL = import.meta.env.VITE_API_URL;

export async function refreshAccessToken(){
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
}
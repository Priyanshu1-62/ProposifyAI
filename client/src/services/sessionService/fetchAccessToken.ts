
export function fetchAccessToken(){
    try {
        const token = localStorage.getItem("accessToken") ?? "";
        return token;
    }
    catch (error) {
        throw error;
    }
}
import axios from "axios";
import qs from "qs";

export async function exchangeAuthCodeForTokens(code: string){
    try {
        const tokenEndpoint = process.env.GOOGLE_TOKEN_ENDPOINT;
        if(!tokenEndpoint){
            throw new Error("Google Token Endpoint not provided.");
        }

        const payload = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        }

        const response = await axios.post(
            tokenEndpoint,
            qs.stringify(payload),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data;
    } 
    catch (error) {
        throw error;
    }
}
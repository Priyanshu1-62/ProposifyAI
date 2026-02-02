const GOOGLE_OAUTH_API_URL = import.meta.env.VITE_GOOGLE_OAUTH_API_URL;

export async function startGoogleOAuth(){
    if(!GOOGLE_OAUTH_API_URL){
        throw new Error("Google OAuth URL is not provided");
    }
    window.location.assign(GOOGLE_OAUTH_API_URL);
}
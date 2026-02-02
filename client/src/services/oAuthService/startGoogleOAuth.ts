const GOOGLE_OAUTH_API_URL = import.meta.env.GOOGLE_OAUTH_API_URL;

export async function startGoogleOAuth(){
    window.location.assign(GOOGLE_OAUTH_API_URL);
}
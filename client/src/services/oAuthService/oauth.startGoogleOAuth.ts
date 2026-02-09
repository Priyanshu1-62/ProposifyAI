import { store } from "../../app/store";
import { setLoading } from "../../features/appState/appState.slice";
import { wakeServer } from "../healthService/health.wakeServer";

const GOOGLE_OAUTH_API_URL = import.meta.env.VITE_GOOGLE_OAUTH_API_URL;

export async function startGoogleOAuth(){

    const dispatch = store.dispatch;

    if(!GOOGLE_OAUTH_API_URL){
        throw new Error("Google OAuth URL is not provided");
    }

    dispatch(setLoading(true));
    try {
        await wakeServer();
    } 
    finally {
        dispatch(setLoading(false));
    }
    
    window.location.assign(GOOGLE_OAUTH_API_URL);
}
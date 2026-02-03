const API_URL = import.meta.env.VITE_API_URL;

export async function wakeServer(){
    const response = await fetch(`${API_URL}/health`);

    if(!(response.ok)){
        throw new Error("Unable to wake up the server...");
    }
}
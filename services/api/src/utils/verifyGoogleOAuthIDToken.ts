import { OAuth2Client } from "google-auth-library";

const clientID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientID);

export async function verifyGoogleOAuthIDToken(idToken: string){
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: clientID,
        });

        const payload = ticket.getPayload();

        if(!payload){
            throw new Error("Invalid Google OAuth ID token payload");
        }

        return {
            googleId: payload.sub,              
            email: payload.email,
            emailVerified: payload.email_verified,
            name: payload.name,
            picture: payload.picture,
        };
    } 
    catch (error) {
        throw error;
    }
}
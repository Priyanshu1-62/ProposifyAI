import { OAuthProvider } from "@prisma/client";
import prisma from "../../lib/prisma";

export async function getOAuthUserProfile(provider: OAuthProvider, providerUserId: string){
    try {
        const oAuthUserProfile = await prisma.oAuthUserProfile.findFirst({where: {provider, providerUserId}});
        return oAuthUserProfile;
    } 
    catch (error) {
        throw error;
    }
}
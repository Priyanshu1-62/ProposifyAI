import prisma from "../../lib/prisma";
import { oAuthUserProfileBody } from "../../types/oAuthInterface/oAuthUserProfileBody";

export async function createOAuthUserProfile(data: oAuthUserProfileBody){
    try {
        const newOAuthUserProfile = await prisma.oAuthUserProfile.create({data});
        return newOAuthUserProfile;
    } 
    catch (error) {
        throw error;
    }
}
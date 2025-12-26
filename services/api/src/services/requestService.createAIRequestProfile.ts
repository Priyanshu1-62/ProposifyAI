import prisma from "../lib/prisma";
import { AIRequestProfileBody } from "../types/AIRequestProfileBody";

export async function createAIRequestProfile(data: AIRequestProfileBody){
    try {
        const aiRequestProfile = await prisma.aIRequestProfile.create({data});
        return aiRequestProfile;
    } 
    catch (error) {
        throw error;
    }
}
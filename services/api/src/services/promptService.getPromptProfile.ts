import prisma from "../lib/prisma";

export async function getPromptPromptProfile(key: string, version: number){
    try {
        const promptProfile = await prisma.promptProfile.findFirst({where: {key, version}});
        return promptProfile;
    } 
    catch (error) {
        throw error;    
    }
}
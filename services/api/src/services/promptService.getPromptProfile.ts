import prisma from "../lib/prisma";

export async function getPromptProfile(key: string, version: number){
    try {
        const promptProfile = await prisma.promptProfile.findFirst({where: {key, version}});
        return promptProfile;
    } 
    catch (error) {
        throw error;    
    }
}
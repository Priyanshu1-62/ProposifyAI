import prisma from "../../lib/prisma";

export async function getAIRequestProfile(aiRequestProfileId: string) {
    try {
        const aiRequestProfile = await prisma.aIRequestProfile.findFirst({where: {id: aiRequestProfileId}});
        return aiRequestProfile;
    } 
    catch (error) {
      throw error;  
    }
}
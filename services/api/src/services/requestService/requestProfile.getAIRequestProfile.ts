import prisma from "../../lib/prisma";

export async function getAIRequestProfile(requestId: string) {
    try {
        const aiRequestProfile = await prisma.aIRequestProfile.findFirst({where: {requestId}});
        return aiRequestProfile;
    } 
    catch (error) {
      throw error;  
    }
}
import prisma from "../../lib/prisma";

export async function deleteRefreshToken(userId: string){
    try {
        await prisma.refreshTokenVault.deleteMany({where: {userId}});
    } 
    catch (error) {
        throw error;
    }
}
import prisma from "../../lib/prisma";
import { createCryptoHash } from "../../utils/createCryptoHash";

export async function getRefreshTokenVault(refreshToken: string){
    try {
        const hashedRefreshToken = createCryptoHash(refreshToken);
        const linkedRefreshTokenVault = await prisma.refreshTokenVault.findFirst({where: {tokenHash: hashedRefreshToken}});
        return linkedRefreshTokenVault;
    } 
    catch (error) {
        throw error;
    }
}
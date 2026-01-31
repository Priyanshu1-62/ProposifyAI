import { createCryptoHash } from "../../utils/createCryptoHash";
import { createRandomCryptoString } from "../../utils/createRandomCryptoString";
import { refreshTokenCreateBody } from "../../types/refreshTokenInterface/refreshTokenCreateBody"
import prisma from "../../lib/prisma";

export async function createRefreshToken(userId: string){
    const refreshToken = createRandomCryptoString();
    const hashedRefreshToken = createCryptoHash(refreshToken);

    const data: refreshTokenCreateBody = {
        expiresAt: new Date(Date.now() + 30*24*60*60*1000),
        isRevoked: false,
        tokenHash: hashedRefreshToken,
        userId
    }

    await prisma.refreshTokenVault.create({data});

    return refreshToken;
}
export interface refreshTokenCreateBody {
    expiresAt: Date;
    isRevoked: boolean;
    tokenHash: string;
    userId: string;
}
import { OAuthProvider } from "@prisma/client";

export interface oAuthUserProfileBody {
    provider: OAuthProvider
    providerUserId : string;
    userId: string;
}
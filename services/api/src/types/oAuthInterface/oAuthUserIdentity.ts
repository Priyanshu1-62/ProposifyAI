import { OAuthProvider } from "@prisma/client";

export interface oAuthUserIdentity {
    provider: OAuthProvider
    providerUserId: string;

    name? : string;
    email?: string;
    emailVerified?: boolean;
    avatarUrl?: string;

    rawUserProfile?: object;
}
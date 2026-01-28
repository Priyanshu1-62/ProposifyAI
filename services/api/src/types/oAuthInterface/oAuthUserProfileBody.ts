export type oAuthProvider = "GOOGLE" | "GITHUB" | "MICROSOFT";

export interface oAuthUserProfileBody {
    provider: oAuthProvider;
    providerUserId: string;

    name? : string;
    email?: string;
    emailVerified?: boolean;
    avatarUrl?: string;

    rawUserProfile?: object;
}
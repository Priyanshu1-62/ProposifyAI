import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";
import { exchangeAuthCodeForTokens } from "../services/oAuthService/googleOAuth.getAccessToken";
import { verifyGoogleOAuthIDToken } from "../utils/verifyGoogleOAuthIDToken";
import { authenticateOAuthUserIdentity } from "../services/domainService/domainService.authenticateOAuthUserIdentity";
import { oAuthUserIdentity } from "../types/oAuthInterface/oAuthUserIdentity";
import { createRefreshToken } from "../services/tokenService/refreshToken.createRefreshToken";

const googleCallbackController = async (req: Request, res: Response) => {
    try {

        const { code, state } = req.query;
        
        if((!code) || typeof code !== "string"){
            return res.status(400).json({error: "Missing or invalid Google Authorization token."});
        }
        if((!state) || typeof state !== "string"){
            return res.status(400).json({error: "Missing or invalid Google OAuth state."});
        }

        // TODO: Use state for CSRF protection

        const tokens = await exchangeAuthCodeForTokens(code);

        const { id_token } = tokens;
        if(!id_token){
            return res.status(400).json({error: "Missing Google ID Token"});
        }

        const userGoogleProfile = await verifyGoogleOAuthIDToken(id_token);

        const oAuthUserIdentity: oAuthUserIdentity = {
            provider: "GOOGLE",
            providerUserId: userGoogleProfile.googleId,

            name: userGoogleProfile.name,
            email: userGoogleProfile.email,
            emailVerified: userGoogleProfile.emailVerified,
            avatarUrl: userGoogleProfile.picture,

            rawUserProfile: userGoogleProfile
        }

        const existingOAuthUser = await authenticateOAuthUserIdentity(oAuthUserIdentity);
        const refreshToken = await createRefreshToken(existingOAuthUser.userId);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 30*24*60*60*1000
        });
        
        return res.redirect(302, process.env.FRONTEND_HOME_URL!);
    } 
    catch (error) {
        logger.error("Google OAuth callback error", {
            service: "GOOGLE_OAUTH_CALLBACK"
        });
        return res.status(500).json({error: "Internal Server Errror"});
    }
}

export default googleCallbackController;
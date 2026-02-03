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
            return res.redirect(302, `${process.env.FRONTEND_AUTH_URL!}?error=invalid_google_oauth_token`);
        }
        if((!state) || typeof state !== "string"){
            return res.redirect(302, `${process.env.FRONTEND_AUTH_URL!}?error=invalid_google_oauth_state`);
        }

        // TODO: Use state for CSRF protection

        const tokens = await exchangeAuthCodeForTokens(code);

        const { id_token } = tokens;
        if(!id_token){
            return res.redirect(302, `${process.env.FRONTEND_AUTH_URL!}?error=missing_google_oauth_id_token`);
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
    catch (err) {
        const error = err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : {
                message: String(err),
              };

        logger.error("Google OAuth callback error", {
            service: "GOOGLE_OAUTH_CALLBACK",
            error
        });

        return res.redirect(302, `${process.env.FRONTEND_AUTH_URL!}?error=google_oauth_callback_failed`);
    }
}

export default googleCallbackController;
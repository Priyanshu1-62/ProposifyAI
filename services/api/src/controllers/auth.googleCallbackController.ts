import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";
import { exchangeAuthCodeForTokens } from "../services/oAuthService/googleOAuth.getAccessToken";
import { verifyGoogleOAuthIDToken } from "../utils/verifyGoogleOAuthIDToken";
import { authenticateOAuthUserProfile } from "../services/domainService/domainService.authenticateOAuthUserProfile";

const googleCallbackController = async (req: Request, res: Response) => {
    try {
        const { code, state } = req.params;
        if(!code){
            return res.status(400).json({error: "Missing Google Authorization token"});
        }

        const tokens = await exchangeAuthCodeForTokens(code);

        const { id_token } = tokens;
        if(!id_token){
            return res.status(400).json({error: "Missing Google ID Token"});
        }

        const userGoogleProfile = await verifyGoogleOAuthIDToken(id_token);

        authenticateOAuthUserProfile(userGoogleProfile);

        
        return res.status(200).json({userGoogleProfile});
    } 
    catch (error) {
        logger.error("Google OAuth callback error", {
            service: "GOOGLE_OAUTH"
        });
        return res.status(500).json({error: "Internal Server Errror"});
    }
}

export default googleCallbackController;
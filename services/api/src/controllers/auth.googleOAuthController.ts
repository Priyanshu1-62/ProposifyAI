import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

const googleOAuthController = async (req: Request, res: Response) => {
    try {
        const googleAuthUrl =
            (process.env.GOOGLE_AUTHORIZATION_URL_BASE!) +
            "?client_id=" + encodeURIComponent(process.env.GOOGLE_CLIENT_ID!) +
            "&redirect_uri=" + encodeURIComponent(process.env.GOOGLE_REDIRECT_URI!) +
            "&response_type=code" +
            "&scope=" + encodeURIComponent("openid email profile") +
            "&access_type=offline" +
            "&prompt=consent" +
            "&state=" + encodeURIComponent("someRandomCSRFToken");
        
        return res.redirect(302, googleAuthUrl);
    } 
    catch (error) {
        logger.error("Google OAuth error", {
            service: "GOOGLE_OAUTH"
        });

        return res.redirect(302, `${process.env.FRONTEND_AUTH_URL!}?error=google_oauth_initiation_failed`);
    }
}

export default googleOAuthController;

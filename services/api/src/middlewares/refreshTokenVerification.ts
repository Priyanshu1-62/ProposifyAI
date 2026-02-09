import { Request, Response, NextFunction } from "express";
import { getRefreshTokenVault } from "../services/tokenService/refreshToken.getRefreshTokenVault";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

export async function refreshTokenVerification(req: Request, res: Response, next: NextFunction){
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            return next();
        }

        const linkedRefreshTokenVault = await getRefreshTokenVault(refreshToken);
        if(!linkedRefreshTokenVault){
            return next();
        }

        req.userId = linkedRefreshTokenVault.userId;
        next();
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

        logger.error("Refresh token verification error", {
            service: "REFRESH_TOKEN_VERIFICATION",
            error
        });
        return res.status(500).json({message: "Refresh token verification Error"});
    }
}
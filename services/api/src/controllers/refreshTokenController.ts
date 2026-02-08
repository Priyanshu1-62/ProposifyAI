import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";
import { getRefreshTokenVault } from "../services/tokenService/refreshToken.getRefreshTokenVault";
import { accessTokenPayloadBody } from "../types/tokenInterface/accessTokenPayloadBody";
import { createAccessToken } from "../utils/token/createAccessToken";

const refreshTokencontroller = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message: "Refresh token not found"});
        }

        const linkedRefreshTokenVault = await getRefreshTokenVault(refreshToken);
        if(!linkedRefreshTokenVault){
            return res.status(401).json({message: "Invalid refresh token"});
        }

        const payload: accessTokenPayloadBody = {
            sub: linkedRefreshTokenVault.userId
        }
        const accessToken = createAccessToken(payload);

        res.setHeader("authorization", `Bearer ${accessToken}`);

        return res.status(200).json({accessToken});
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

        logger.error("Auth Token refresh error", {
            service: "REFRESH_AUTH_TOKEN",
            error
        });

        return res.status(500).json({message: "Failed to refresh acces token"});
    }
}

export default refreshTokencontroller;
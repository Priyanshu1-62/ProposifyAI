import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";
import { deleteRefreshToken } from "../services/tokenService/refreshToken.deleteRefreshTokens";

export const logoutController = async (req: Request, res: Response) => {
    try {
        if(req.userId){
            await deleteRefreshToken(req.userId);
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "lax"
        });
        return res.sendStatus(204);
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

        logger.error("Session logout error", {
            service: "API_SESSION_LOGOUT",
            error
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
        });
      
        return res.sendStatus(204);
    }
}
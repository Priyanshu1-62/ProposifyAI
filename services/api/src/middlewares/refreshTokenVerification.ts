import { Request, Response, NextFunction } from "express";
import { getRefreshTokenVault } from "../services/tokenService/refreshToken.getRefreshTokenVault";

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
    catch (error) {
        return res.status(500).json({message: "Refresh token verification Error"});
    }
}
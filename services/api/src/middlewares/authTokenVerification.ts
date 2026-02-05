import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token/verifyAccessToken";
import { accessTokenPayloadBody } from "../types/tokenInterface/accessTokenPayloadBody";

export function authTokenVerification(req: Request, res: Response, next: NextFunction){
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Access token not found"});
        }

        const token = authHeader.split(" ")[1];

        try {
            const payload: accessTokenPayloadBody = verifyAccessToken(token);
            req.userId = payload.sub;
            next();
        } 
        catch (error) {
            return res.status(401).json({message: "Invalid or expired access token"});
        }
    } 
    catch (error) {
        return res.status(500).json({message: "Auth token verification Error"});
    }
}
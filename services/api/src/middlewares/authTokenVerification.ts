import { Request, Response, NextFunction } from "express";

export function authTokenVerification(req: Request, res: Response, next: NextFunction){
    try {
        req.userId = process.env.SUPERUSER_ID!;
        next();
    } 
    catch (error) {
        return res.status(500).json({message: "Auth token verification Error"});
    }
}
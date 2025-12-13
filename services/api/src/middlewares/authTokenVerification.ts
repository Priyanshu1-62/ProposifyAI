import { Request, Response, NextFunction } from "express";

export function authTokenVerification(req: Request, res: Response, next: NextFunction){
    try {
        const superuserId = process.env.SUPERUSER_ID!;
        req.body.userId = superuserId;
        next();
    } 
    catch (error) {
        return res.status(500).json({message: "Auth token verification Error"});
    }
}
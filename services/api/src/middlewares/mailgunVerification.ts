import { Request, Response, NextFunction } from "express";
import { MailgunSignatureBody } from "../types/MailgunSignatureBody";
import { verifyMailgunSignature } from "../utils/verifyMailgunSignature";

export function mailgunVerification(req: Request, res: Response, next: NextFunction){
    try {
        const maigunSignBody: MailgunSignatureBody = {
            timestamp: req.body?.timestamp,
            token: req.body?.body,
            signature: req.body?.signature,
            apiKey: process.env.MAILGUN_API_KEY!,
            toleranceSeconds: Number(process.env.MAILGUN_WEBHOOK_TOLERANCE_SECONDS)!
        };
        const result = verifyMailgunSignature(maigunSignBody);
        if(!result.ok){
            return res.status(401).json({message: result.reason}); //401 response is good, Mailgun wont retry on it.
        }
        return next();
    } 
    catch (error) {
        return res.status(500).json({message: "Inbound mail verification Error"});
    }
}
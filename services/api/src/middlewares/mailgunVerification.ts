import { Request, Response, NextFunction } from "express";
import { MailgunSignatureBody } from "../types/mailgunInterface/MailgunSignatureBody";
import { verifyMailgunSignature } from "../utils/verifyMailgunSignature";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

export function mailgunVerification(req: Request, res: Response, next: NextFunction){
    try {
        const maigunSignBody: MailgunSignatureBody = {
            timestamp: req.body?.timestamp,
            token: req.body?.body,
            signature: req.body?.signature,
            apiKey: process.env.MAILGUN_API_KEY!,
            toleranceSeconds: Number(process.env.MAILGUN_WEBHOOK_TOLERANCE_SECONDS) || 300
        };
        const result = verifyMailgunSignature(maigunSignBody);
        if(!result.ok){
            return res.status(401).json({message: result.reason}); //401 response is good, Mailgun wont retry on it.
        }
        return next();
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

        logger.error("Mailgun webhook verification error", {
            service: "MAILGUN_WEBHOOK_VERIFICATION",
            error
        });
        return res.status(500).json({message: "Mailgun webhook verification Error"});
    }
}
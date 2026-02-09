import { Request, Response, NextFunction } from 'express';
import { resendSignatureBody } from '../types/resendInterface/resendSignatureBody';
import { verifyResendSignature } from '../utils/verifyResendSignature';
import { stdLogger as logger } from '../utils/loggerInfra/logger';

export async function resendSignatureVerification(req: Request, res: Response, next: NextFunction){
    try {
        const signatureParts = req.headers["resend-signature"] as string;
        const secret = process.env.RESEND_WEBHOOK_SECRET;

        if(!signatureParts){
            return res.status(401).json({message: "Resend signature not found"});
        }
        if(!secret){
            return res.status(401).json({message: "Resend secret key not congifured"});
        }

        const parts = signatureParts.split(',');
        const timeStamp = parts.find(p => p.startsWith("t="));
        const signature = parts.find(p => p.startsWith("v1="));

        if(!timeStamp || !signature){
            return res.status(401).json({message: "Invalid Resend signature"});
        }

        const resendSignBody: resendSignatureBody = {
            secret, 
            timeStamp: timeStamp.split('=')[1], 
            signature: signature.split('=')[1],
            toleranceSeconds: Number(process.env.RESEND_WEBHOOK_TOLERANCE_SECONDS) || 300
        }

        const rawBody = req.body as Buffer;
        if(!Buffer.isBuffer(rawBody)){
            return res.status(400).json({message: "Invalid request body"});
        }

        const result = verifyResendSignature(resendSignBody, rawBody);
        if(!result.ok){
            return res.status(401).json({message: result.reason});
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

        logger.error("Resend signature verification error", {
            service: "RESEND_SIGNATURE_VERIFICATION",
            error
        });
        return res.status(500).json({message: "Resend webhook verification Error"});
    }
}
import crypto from "crypto";
import { resendSignatureBody } from "../types/resendSignatureBody";
import { verifySignatureResponse } from "../types/verifySignatureResponse";


export function verifyResendSignature(webhookData: resendSignatureBody, rawBody: Buffer): verifySignatureResponse{
    try {
        const payload = `${webhookData.timeStamp}.${rawBody.toString("utf-8")}`;

        const tsNum = Number(webhookData.timeStamp);
        if(Number.isNaN(tsNum)){
            return {ok: false, reason: "Invalid timeStamp"}
        }

        const now = Math.floor(Date.now() / 1000);
        if(Math.abs(now - tsNum) > webhookData.toleranceSeconds){
            return {ok: false, reason: "TimeStamp out of tolerance limit"};
        }

        const expectedSignature = crypto.createHmac("sha256", webhookData.secret).update(payload).digest("hex");

        const signBuff = Buffer.from(webhookData.signature);
        const expBuff = Buffer.from(expectedSignature);

        if(signBuff.length != expBuff.length){
            return {ok: false, reason: "Signature length mismatch"};
        }

        if(!crypto.timingSafeEqual(signBuff, expBuff)){
            return {ok: false, reason: "Invalid signature"};
        }
        return {ok: true};
    } 
    catch (error) {
        return {ok: false, reason: "Unable to verify signature"};
    }
}
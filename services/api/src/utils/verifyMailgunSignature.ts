import crypto from "crypto";
import { MailgunSignatureBody } from "../types/MailgunSignatureBody";
import { verifySignatureResponse } from "../types/verifySignatureResponse";

export function verifyMailgunSignature(webhookData: MailgunSignatureBody): verifySignatureResponse{
    try {
        if(!webhookData.timestamp || !webhookData.token || !webhookData.signature){
            return {ok: false, reason: "Fields missing from webhook"};
        }

        const tsNum = Number(webhookData.timestamp);
        if(Number.isNaN(tsNum)){
            return {ok: false, reason: "Invalid Timestamp"};
        }

        const now = Math.floor(Date.now() / 1000);
        if(Math.abs(now - tsNum) > webhookData.toleranceSeconds){
            return {ok: false, reason: "Timestamp out of tolerance limit"};
        }

        const req_Signature = crypto.createHmac("sha256", webhookData.apiKey);
        req_Signature.update(String(webhookData.timestamp) + webhookData.token);
        const expected_hmac= req_Signature.digest("hex");

        const signBuff = Buffer.from(webhookData.signature, "utf-8");
        const expBuff = Buffer.from(expected_hmac, "utf-8");

        if(signBuff.length != expBuff.length){
            return {ok: false, reason: "Signature length mismatch"};
        }

        if(!crypto.timingSafeEqual(signBuff, expBuff)){
            return {ok: false, reason: "Invalid Signature"};
        }

        return {ok: true};
    } 
    catch (error) {
        return {ok: false, reason: "Unable to verify signature"};
    }
}
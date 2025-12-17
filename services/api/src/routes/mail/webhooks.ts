import { Router, Request, Response } from "express";
import express from "express";
import handleMailgunInbound from "../../controllers/mail.InboundController";
import { mailgunVerification } from "../../middlewares/mailgunVerification";
import { resendSignatureVerification } from "../../middlewares/resendSignatureVerification";
import handleResendWebhook from "../../controllers/mail.resendWebhookController";

const router = Router();

router.post('/inbound', mailgunVerification, handleMailgunInbound);

router.post('/resend', express.raw({ type: "application/json" }), resendSignatureVerification, handleResendWebhook);

export default router;
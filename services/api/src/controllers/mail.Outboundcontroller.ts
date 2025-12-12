import { Request, Response } from "express";
import { sendBulkEmailResend } from "../services/mailService.resend";
import { sendBulkEmailBrevo } from "../services/mailService.brevo";

//sendBulkEmailBrevo() and sendBulkEmailResend() takes same input, and are inter-replacable.
const handleResendOutbound = async (req: Request, res: Response) => {
    try {
        const { from, bcc, subject, html } = req.body;
        const result = await sendBulkEmailResend({ from: "request@proposifyai.online", to: "notifications@proposify.ai", bcc, subject, html }); 
        return res.status(200).json(result);
    }
    catch(error) {
        return res.status(500).json({message: "Failed to send e-mails."})
    }
}

export default handleResendOutbound;
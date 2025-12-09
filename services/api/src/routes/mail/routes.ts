import { Router, Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import sendBulkMails from "../../controllers/mail.controller";

const router = Router();

router.post('/sendBulkMails', [
  body("from")
    .notEmpty().withMessage("Sender's mail not provided"),
  body("bcc")
    .notEmpty().withMessage("No respondents provided"),
  body("subject")
    .notEmpty().withMessage("Mail subject not provided"),
  body("html")
    .notEmpty().withMessage("No HTML content body provided")
], (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }
        return sendBulkMails(req, res);
    } catch (error) {
        return res.status(500).json({message: "Failed to send e-mails."})
    }
});

export default router;
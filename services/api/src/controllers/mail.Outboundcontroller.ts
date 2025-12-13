import { Request, Response } from "express";
import { sendBulkEmailResend } from "../services/mailService.resend";
import { sendBulkEmailBrevo } from "../services/mailService.brevo";
import { createRequest } from "../services/requestService.createRequest";
import { bulkEmailPayload } from "../types/bulkEmailPayload";
import prisma from "../lib/prisma";

//sendBulkEmailBrevo() and sendBulkEmailResend() takes same input, and are inter-replacable.
const createRequestandSendMails = async (req: Request, res: Response) => {
    try {
        const newRequest = await createRequest(req.body);

        const respondents = await prisma.respondent.findMany({where: {groupId: req.body.respondentGroupId}});
        if(!respondents.length){
            return res.status(400).json({message: "No respondents found in this group."});
        }
        const emails = respondents.map(element => element.email);
        const emailPayload: bulkEmailPayload = {
            from: "request@proposifyai.online",
            to: "notifications@proposify.ai",
            bcc: emails,
            subject: req.body.title,
            text: req.body.description,
            html: `<p>${req.body.description}</p>`,
            tags: [{name: "requestId", value: newRequest.id}]
        }
        await sendBulkEmailResend(emailPayload); 

        return res.status(201).json(newRequest);
    }
    catch(error) {
        return res.status(500).json({message: "Failed to make the request."})
    }
}

export default createRequestandSendMails;
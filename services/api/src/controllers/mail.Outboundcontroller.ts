import { Request, Response } from "express";
import { sendEmailResend } from "../services/mailService.resend";
import { createRequest } from "../services/requestService.createRequest";
import { bulkEmailPayload } from "../types/bulkEmailPayload";
import prisma from "../lib/prisma";
import { createOutboundEntry } from "../services/analyticsService.outboundEntry";
import { createOutboundAttempt } from "../services/analyticsService.createAttempt";
import { updateOutboundAttempt } from "../services/analyticsService.updateAttempt";
import { createRequestProfile } from "../services/domainService.createRequestProfile";

const createRequestandSendMails = async (req: Request, res: Response) => {
    try {
        const newRequest = await createRequest(req.body);

        const respondents = await prisma.respondent.findMany({where: {groupId: req.body.respondentGroupId}});
        if(!respondents.length){
            return res.status(400).json({message: "No respondents found in this group."});
        }
        const emails = respondents.map(element => element.email);
        const emailPayload: bulkEmailPayload = {
            from: `request+${newRequest.id}@proposifyai.online`,
            to: "",
            subject: req.body.title,
            text: req.body.description,
            html: `<p>${req.body.description}</p>`,
            tags: [ 
                    {name: "userId", value: req.body.userId},
                    {name: "requestId", value: newRequest.id},
                    {name: "respondentGroupId", value: req.body.respondentGroupId}
                ]
        }

        const response = await Promise.allSettled(
            emails.map(async (email) => {
                let attempt = null;
                try {
                    const payload = {...emailPayload, to: email};
                    attempt = await createOutboundAttempt(payload);
                    const outboundResult = await sendEmailResend(payload);
                    if(outboundResult.data){
                        const outboundEntry = await createOutboundEntry(payload, outboundResult.data.id);
                        const result = await updateOutboundAttempt(attempt.id, {outboundEmailId: outboundEntry.id, status: "SUCCESS"});
                        return result;
                    }
                    else{
                        const result = await updateOutboundAttempt(attempt.id, {status: "FAILED", failureReason: "PROVIDER_ERROR"});
                        return result;
                    }
                } 
                catch (error) {
                    if(attempt && attempt.id){
                        await updateOutboundAttempt(attempt.id, {status: "FAILED", failureReason: "PROVIDER_ERROR"});
                    }
                }
            })
        );

        createRequestProfile(newRequest.id, newRequest.description);

        return res.status(201).json(response);
    }
    catch(error) {
        return res.status(500).json({message: "Failed to make the request."})
    }
}

export default createRequestandSendMails;
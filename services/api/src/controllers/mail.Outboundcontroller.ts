import { Request, Response } from "express";
import { sendEmailResend } from "../services/mailService/mailService.resend";
import { createRequest } from "../services/requestService/requestService.createRequest";
import { bulkEmailPayload } from "../types/mailInterface/bulkEmailPayload";
import prisma from "../lib/prisma";
import { createOutboundEntry } from "../services/outboundMailService/outboundService.outboundEntry";
import { createOutboundAttempt } from "../services/outboundMailService/outboundService.createAttempt";
import { updateOutboundAttempt } from "../services/outboundMailService/outboundService.updateAttempt";
import { createRequestProfile } from "../services/domainService/domainService.createRequestProfile";
import { createRequestOverview } from "../services/requestService/requestOverview.createOverview";
import { updateRequestOverview } from "../services/requestService/requestOverview.updateOverview";

const createRequestandSendMails = async (req: Request, res: Response) => {
    try {
        const newRequest = await createRequest(req.body);
        
        await createRequestOverview(newRequest.id, newRequest.respondentGroupId, "CREATED");

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
                        updateRequestOverview(newRequest.id, 
                            {
                                lastOutboundMailTimeStamp: new Date(), 
                                lastUpdatedAt: new Date()
                            }, 
                            {outboundMailSentCount: 1}
                        );

                        const outboundEntry = await createOutboundEntry(payload, outboundResult.data.id);
                        const result = await updateOutboundAttempt(attempt.id, {outboundEmailId: outboundEntry.id, status: "SUCCESS"});
                        return result;
                    }
                    else{
                        updateRequestOverview(newRequest.id, 
                            {
                                lastOutboundMailTimeStamp: new Date(), 
                                lastUpdatedAt: new Date()
                            }, 
                            {outboundMailFailedCount: 1}
                        );
                        
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

        await updateRequestOverview(newRequest.id, {status: "EMAILS_SENT"}, {});

        createRequestProfile(newRequest.id, newRequest.description);

        return res.status(201).json(response);
    }
    catch(error) {
        return res.status(500).json({message: "Failed to make the request."})
    }
}

export default createRequestandSendMails;
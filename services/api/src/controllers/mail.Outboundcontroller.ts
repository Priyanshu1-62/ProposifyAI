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
import { updateRespondent } from "../services/respondentService/respondentService.updateRespondent";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

const createRequestandSendMails = async (req: Request, res: Response) => {
    try {
        if(!req.userId){
            return res.status(400).json({message: "UserId not found."});
        }
        const newRequest = await createRequest(req.userId, req.body);
        
        await createRequestOverview(newRequest.id, newRequest.title, newRequest.description, newRequest.respondentGroupId, "CREATED", newRequest.userId);

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
                        await updateRequestOverview(newRequest.id, 
                            {
                                lastOutboundMailTimeStamp: new Date(), 
                                lastUpdatedAt: new Date()
                            }, 
                            {outboundMailSentCount: 1}
                        );

                        await updateRespondent(email, req.body.respondentGroupId, {outboundStatus: "SENT"});

                        const outboundEntry = await createOutboundEntry(payload, outboundResult.data.id);
                        const result = await updateOutboundAttempt(attempt.id, {outboundEmailId: outboundEntry.id, status: "SUCCESS"});
                        return result;
                    }
                    else{
                        await updateRequestOverview(newRequest.id, 
                            {
                                lastOutboundMailTimeStamp: new Date(), 
                                lastUpdatedAt: new Date()
                            }, 
                            {outboundMailFailedCount: 1}
                        );

                        await updateRespondent(email, req.body.respondentGroupId, {outboundStatus: "FAILED"});
                        
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

        // TODO: Replace this by (an intent store + worker) combi to get durable list of pending/failed tasks to be done as server restarts.
        createRequestProfile(newRequest.id, newRequest.description);

        return res.status(201).json(response);
    }
    catch(err) {
        const error = err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : {
                message: String(err),
              };

        logger.error("Outbound handling error", {
            service: "MAIL_OUTBOUND",
            error
        });
        return res.status(500).json({message: "Failed to make the request."});
    }
}

export default createRequestandSendMails;
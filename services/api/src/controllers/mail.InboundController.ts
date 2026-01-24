import { Request, Response } from "express";
import { getRequest } from "../services/requestService/requestService.getRequest";
import { getInboundMessage } from "../services/inboundMailService/inboundService.getInboundMessage";
import { createInboundMessage } from "../services/inboundMailService/inboundService.createInbound";
import { inboundMessageContentBody } from "../types/inboundMailInterace/inboundMessageContentBody";
import { createInboundContent } from "../services/inboundMailService/inboundService.createInboundContent";
import { createInboundAttachment } from "../services/inboundMailService/inboundService.createInboundAttachment";
import { mailgunAttachmentBody } from "../types/mailgunInterface/mailgunAttachmentBody";
import { createResponseEvaluation } from "../services/domainService/domainService.createResponseEvaluation";
import { updateRequestOverview } from "../services/requestService/requestOverview.updateOverview";
import { updateRespondent } from "../services/respondentService/respondentService.updateRespondent";

// Always return status 200 response to Mailgun to avoid retries.
const handleMailgunInbound = async (req: Request, res: Response) => {
    try {
        const recipient = req.body.recipient;
        const requestId = recipient?.split('@')[0].split('+')[1];

        if(!requestId){
            return res.status(200).json({message: "Invalid inbound email"});
        }

        const linkedRequest = await getRequest(requestId);
        if(!linkedRequest){
            return res.status(200).json({message: "Invalid inbound email"});
        }

        const messageId = req.body["Message-Id"] || req.body["message-id"];
        const isRetriedMailgunDelivery = await getInboundMessage(messageId);
        if(isRetriedMailgunDelivery){
            return res.status(200).json({message: "A webhook for same email message already arrived earlier."});
        }

        const isReSubmission = await getInboundMessage({from: req.body.from, requestId: linkedRequest.id});
        if(isReSubmission){
            return res.status(200).json({message: "A respondent may submit exactly one proposal per request."});
        }

        await updateRequestOverview(requestId,
            {
                lastInboundMailTimeStamp: new Date(),
                lastUpdatedAt: new Date()
            },
            {
                inboundMailCount: 1
            }
        );

        await updateRespondent(req.body.from, linkedRequest.respondentGroupId, {inboundStatus: "RECEIVED"});

        const inboundMessage = await createInboundMessage(req.body.from, messageId, linkedRequest.id);

        const messageContent: inboundMessageContentBody = {
            subject: req.body.subject,
            text: req.body["body-plain"] || "",
            html: req.body["body-html"] || "",
            inboundMessageId: inboundMessage.id
        }
        const inboundMessageContent = await createInboundContent(messageContent);

        const allAttachments: mailgunAttachmentBody[] = req.body["attachments"] || [];

        await Promise.allSettled(
            allAttachments.map(async (attachment) => {
                if(!attachment.name || !attachment.url || !attachment["content-type"] || !attachment.size) return;
                const attachmentData = {
                    fileName: attachment.name,
                    contentType: attachment["content-type"],
                    size: attachment.size,
                    url: attachment.url
                }
                return await createInboundAttachment(attachmentData, inboundMessage.id);
            })
        );

        createResponseEvaluation(req.body.from, linkedRequest.respondentGroupId, messageContent.text, requestId, inboundMessage.id);

        return res.status(200).json({message: "Inbound message data stored successfully"});
    } 
    catch (error) {
        return res.status(200).json({status: "failure", error});
    }
}

export default handleMailgunInbound;
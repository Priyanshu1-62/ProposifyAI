import { Request, Response } from "express";
import { getRequest } from "../services/requestService.getRequest";
import { getInboundMessage } from "../services/inboundService.getInboundMessage";
import { createInboundMessage } from "../services/inboundService.createInbound";
import { inboundMessageContentBody } from "../types/inboundMessageContentBody";
import { createInboundContent } from "../services/inboundService.createInboundContent";
import { createInboundAttachment } from "../services/inboundService.createInboundAttachment";
import { mailgunAttachmentBody } from "../types/mailgunAttachmentBody";
import { createResponseEvaluation } from "../services/domainService.createResponseEvaluation";

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

        createResponseEvaluation(messageContent.text, linkedRequest.aiRequestProfileId, inboundMessage.id);

        return res.status(200).json({message: "Inbound message data stored successfully"});
    } 
    catch (error) {
        return res.status(200).json({status: "failure", error});
    }
}

export default handleMailgunInbound;
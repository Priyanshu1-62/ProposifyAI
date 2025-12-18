import { Request, Response } from "express";
import { resendEventTypeMap } from "../types/resendEventTypeMap";
import { outboundEmailEventBody } from "../types/outboundEmailEventBody";
import { createOutboundEmailEvent } from "../services/analyticsService.createEvent";
import { findUniqueOutbound } from "../services/analyticsService.findUniqueOutbound";
import terminalEmailEvent from "../utils/verifyTerminalEmailEvent";
import { updateOutboundStatus } from "../services/analyticsService.updateOutboundStatus";
import { OutboundEmailStatus } from "@prisma/client";

const handleResendWebhook = async (req: Request, res: Response) => {
    try {
        const event = JSON.parse(req.body.toString("utf-8"));
        const eventType = resendEventTypeMap[event.type];

        if(!eventType){
            return res.status(200).json({ignored: true, reason: "Received event type is not subscribed"});
        }

        const outboundEmail = await findUniqueOutbound(event.data.id);
        if(!outboundEmail){
            return res.status(200).json({ignored: true, reason: "No corresponding email exists"});
        }

        const data: outboundEmailEventBody = { 
            eventType,
            occurredAt: new Date(event.data.created_at),
            outboundEmailId: outboundEmail.id
        }
        const result = await createOutboundEmailEvent(data);

        if(terminalEmailEvent.has(eventType) && outboundEmail.status == "SENT"){
            await updateOutboundStatus(outboundEmail.id, eventType as OutboundEmailStatus);
        }
             
        return res.status(200).json({ received: true, result });
    } 
    catch (error) {
        console.log("Failed to process webhook", error);
        return res.status(200).json({received: true }); 
    }
}

export default handleResendWebhook;
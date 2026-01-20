import { Request, Response } from "express";
import { resendEventTypeMap } from "../types/resendInterface/resendEventTypeMap";
import { outboundEmailEventBody } from "../types/outboundMailInterface/outboundEmailEventBody";
import { createOutboundEmailEvent } from "../services/analyticsService/analyticsService.createEvent";
import { findUniqueOutbound } from "../services/analyticsService/analyticsService.findUniqueOutbound";
import terminalEmailEvent from "../utils/verifyTerminalEmailEvent";
import { EmailEventType, OutboundEmailStatus } from "@prisma/client";
import { updateoutboundEmail } from "../services/analyticsService/analyticsService.updateOutboundEmail";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

const handleResendWebhook = async (req: Request, res: Response) => {
    try {
        const event = JSON.parse(req.body.toString("utf-8"));
        const eventType: EmailEventType = resendEventTypeMap[event.type];

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
        await updateoutboundEmail(outboundEmail.id, {current_status: eventType});


        if(terminalEmailEvent.has(eventType) && outboundEmail.status == "SENT"){
            await updateoutboundEmail(outboundEmail.id, {status: eventType as OutboundEmailStatus});
        }
             
        return res.status(200).json({ received: true, result });
    } 
    catch (error) {
        return res.status(200).json({received: true }); 
    }
}

export default handleResendWebhook;
import { Request, Response } from "express";
import { resendEventTypeMap } from "../types/resendInterface/resendEventTypeMap";
import { outboundEmailEventBody } from "../types/outboundMailInterface/outboundEmailEventBody";
import { createOutboundEmailEvent } from "../services/outboundMailService/outboundService.createEvent";
import { findUniqueOutbound } from "../services/outboundMailService/outboundService.findUniqueOutbound";
import terminalEmailEvent from "../utils/verifyTerminalEmailEvent";
import { EmailEventType, OutboundEmailStatus } from "@prisma/client";
import { updateoutboundEmail } from "../services/outboundMailService/outboundService.updateOutboundEmail";
import eventCounterFunction from "../utils/eventCounterFunction";
import { updateRequestOverview } from "../services/requestService/requestOverview.updateOverview";
import { findUniqueOutboundEvent } from "../services/outboundMailService/outboundService.findUniqueOutbuondEvent";

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

        const isRetriedResendWebhook = await findUniqueOutboundEvent(outboundEmail.id, eventType);
        if(isRetriedResendWebhook){
            return res.status(200).json({ignored: true, reason: "A webhook for same event already arrived earlier."});
        }

        const data: outboundEmailEventBody = { 
            eventType,
            occurredAt: new Date(event.data.created_at),
            outboundEmailId: outboundEmail.id
        }

        if(eventType in eventCounterFunction){
            const counterFunction = eventCounterFunction[eventType];
            if(counterFunction) await updateRequestOverview(outboundEmail.requestId, 
                {
                    lastOutboundMailTimeStamp: new Date(), 
                    lastUpdatedAt: new Date()
                }, 
                {
                    [counterFunction]: 1
                }
            );
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
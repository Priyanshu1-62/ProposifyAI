import { Request, Response } from "express";

const handleResendWebhook = (req: Request, res: Response) => {
    try {
        const event = JSON.parse(req.body.toString("utf-8"));

        console.log(event);
        
        return res.status(200).json({ received: true });
    } 
    catch (error) {
        return res.status(200).json({message: "Failed to receive webhooks" }); 
    }
}

export default handleResendWebhook;
import { Request, Response } from "express";
import { processInboundEmail } from "../services/mailService.inbound";

// Always return status 200 response to Mailgun to avoid retries.
const handleMailgunInbound = async (req: Request, res: Response) => {
    try {
        const result = await processInboundEmail(req.body);
        return res.status(200).json({status: "success", result});
    } 
    catch (error) {
        return res.status(200).json({status: "failure", error});
    }
}

export default handleMailgunInbound;
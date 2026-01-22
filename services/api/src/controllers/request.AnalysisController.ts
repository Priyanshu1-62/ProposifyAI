import { Request, Response } from "express";
import { collectRequestData } from "../services/domainService/domainService.collectRequestData";

const requestAnalysisController = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const requestAnalysisData = await collectRequestData(requestId);
        return requestAnalysisData;
        
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default requestAnalysisController;
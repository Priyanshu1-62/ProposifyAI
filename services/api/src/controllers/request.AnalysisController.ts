import { Request, Response } from "express";
import { collectRequestData } from "../services/domainService/domainService.collectRequestData";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

const requestAnalysisController = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const requestAnalysisData = await collectRequestData(requestId);
        return requestAnalysisData;
        
    } 
    catch (err) {
        const error = err instanceof Error
            ? {
                name: err.name,
                message: err.message,
                stack: err.stack,
              }
            : {
                message: String(err),
              };

        logger.error("Request analysis error", {
            service: "REQUEST_ANALYSIS",
            error
        });
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default requestAnalysisController;
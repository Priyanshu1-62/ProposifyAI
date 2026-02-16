import { Request, Response } from "express";
import { stdLogger as logger } from "../utils/loggerInfra/logger";
import { getRequestOverviews } from "../services/requestService/requestOverview.getOverviews";

const requestOverviewsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if(!userId){
            return res.status(401).json({message: "User data not found"});
        }
        
        const requestOverviews = await getRequestOverviews(userId);
        return requestOverviews
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

export default requestOverviewsController;
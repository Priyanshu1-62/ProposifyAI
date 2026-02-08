import { Request, Response } from "express";
import { getRespondents } from "../services/respondentService/respondentService.getRespondents";
import { stdLogger as logger } from "../utils/loggerInfra/logger";

const respondentGroupAnalysisController = async (req: Request, res: Response) => {
    try {
        const { reqpondentGroupId } = req.params;
        const respondents = await getRespondents(reqpondentGroupId);
        return respondents;
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

        logger.error("Respondent group analysis failure", {
            service: "RESPONDENT_GROUP_ANALYSIS",
            error
        });
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default respondentGroupAnalysisController;
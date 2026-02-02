import { Request, Response } from "express";
import { getRespondents } from "../services/respondentService/respondentService.getRespondents";

const respondentGroupAnalysisController = async (req: Request, res: Response) => {
    try {
        const { reqpondentGroupId } = req.params;
        const respondents = await getRespondents(reqpondentGroupId);
        return respondents;
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default respondentGroupAnalysisController;
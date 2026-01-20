import { Request, Response } from "express";

const requestAnalysisController = async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
}

export default requestAnalysisController;
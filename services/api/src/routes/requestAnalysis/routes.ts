import { Router, Request, Response } from "express";
import { authTokenVerification } from "../../middlewares/authTokenVerification";
import requestAnalysisController from "../../controllers/requestAnalysisController";

const router = Router();

router.get('/getRequestAnalysis/:requestId', authTokenVerification, requestAnalysisController);

export default router;
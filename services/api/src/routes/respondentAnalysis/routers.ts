import { Router } from "express";
import { authTokenVerification } from "../../middlewares/authTokenVerification";
import respondentGroupAnalysisController from "../../controllers/respondentGroup.AnalysisController";

const router = Router();

router.get('/getRespondentGroupAnalysis/:respondentGroupId', authTokenVerification, respondentGroupAnalysisController);

export default router;
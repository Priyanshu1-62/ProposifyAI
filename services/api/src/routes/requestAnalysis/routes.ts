import { Router } from "express";
import { authTokenVerification } from "../../middlewares/authTokenVerification";
import requestAnalysisController from "../../controllers/request.AnalysisController";
import requestOverviewsController from "../../controllers/requestOverviewsController";

const router = Router();

router.get('/getRequestAnalysis/:requestId', authTokenVerification, requestAnalysisController);

router.get('/getRequestOverviews', authTokenVerification, requestOverviewsController);

export default router;
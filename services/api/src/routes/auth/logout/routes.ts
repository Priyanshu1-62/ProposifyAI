import { Router } from "express";
import { logoutController } from "../../../controllers/logoutController";
import { refreshTokenVerification } from "../../../middlewares/refreshTokenVerification";

const router = Router();

router.get('/logout', refreshTokenVerification, logoutController);

export default router;
import { Router } from "express";
import googleCallbackController from "../../../controllers/auth.googleCallbackController";

const router = Router();

router.get('/google/callback', googleCallbackController);

export default router;
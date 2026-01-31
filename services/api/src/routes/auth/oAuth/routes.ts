import { Router } from "express";
import googleCallbackController from "../../../controllers/auth.googleCallbackController";
import googleOAuthController from "../../../controllers/auth.googleOAuthController";

const router = Router();

router.get('/google', googleOAuthController);

router.get('/google/callback', googleCallbackController);

export default router;
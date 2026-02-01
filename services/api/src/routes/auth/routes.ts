import { Router } from "express";
import oauthRoutes from "./oAuth/routes";

const router = Router();
router.use("/oauth", oauthRoutes);

export default router;
import { Router } from "express";
import oauthRoutes from "./oAuth/routes";
import tokenRoutes from "./token/routes"

const router = Router();
router.use("/oauth", oauthRoutes);
router.use("/token", tokenRoutes);

export default router;
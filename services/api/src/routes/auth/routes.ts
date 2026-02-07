import { Router } from "express";
import oauthRoutes from "./oAuth/routes";
import tokenRoutes from "./token/routes"
import logoutRoutes from "./logout/routes";

const router = Router();
router.use("/oauth", oauthRoutes);
router.use("/token", tokenRoutes);
router.use("/logout", logoutRoutes);

export default router;
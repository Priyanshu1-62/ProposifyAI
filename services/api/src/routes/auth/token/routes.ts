import { Router } from "express";
import refreshTokencontroller from "../../../controllers/refreshTokenController";

const router = Router();

router.get('/refresh', refreshTokencontroller);

export default router;
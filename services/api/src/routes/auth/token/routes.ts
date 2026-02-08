import { Router } from "express";
import refreshTokencontroller from "../../../controllers/refreshTokenController";

const router = Router();

router.post('/refresh', refreshTokencontroller);

export default router;
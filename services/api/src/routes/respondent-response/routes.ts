import { Router } from "express";

const router = Router();

const superuserId = process.env.SUPERUSER_ID!;

router.get('/', (req, res) => {

});

export default router;
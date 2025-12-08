import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';

const router = Router();

const superuserId = process.env.SUPERUSER_ID!;

router.post('/createUser', [], async (req: Request, res: Response) => {
    try {
        const {name, email, password, plan} = req.body;

        // Update required to create multi-user app. Also, update validation chain.
        const existingUser = await prisma.user.findFirst();
        if(existingUser){
            return res.status(403).json({message: "User Limit Exceeded"});
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({data: {name, email, password: hash, plan}});

        return res.status(201).json({id: user.id, name, email, plan});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;
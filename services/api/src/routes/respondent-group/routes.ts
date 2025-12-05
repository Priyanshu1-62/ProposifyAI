import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/getGroup/:groupId', async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const group = await prisma.respondentGroup.findUnique({where: {id: groupId}});

        if(!group){
            return res.status(404).json({message: "Group Not Found"});
        }
        return res.status(200).json(group);
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getGroups/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const groups = await prisma.respondentGroup.findMany({where: {userId}});

        return res.status(200).json(groups);
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/createGroup', [
    body('name')
      .trim()
      .notEmpty()
      .isString()
      .withMessage('Enter a valid non-empty string')
      .bail()
      .isLength({max: 70})
      .withMessage('Maximum number of allowed characters is 70')
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }
        const { name, userId } = req.body;
        const newGroup = await prisma.respondentGroup.create({data: {name, userId}});

        return res.status(201).json({group: newGroup});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.delete('/deleteGroup/:groupId', async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        await prisma.respondentGroup.delete({where: {id: groupId}});

        return res.status(200).json({message: "Group deleted successfully"});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;
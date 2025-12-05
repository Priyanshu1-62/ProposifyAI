import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/getRespondent/:respondentId', async (req: Request, res: Response) => {
    try {
        const { respondentId } = req.params;
        const respondent = await prisma.respondent.findUnique({where: {id: respondentId}});

        if(!respondent){
            return res.status(404).json({message: "Respondent Not Found"});
        }
        return res.status(200).json(respondent);
        
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getRespondents/:groupId', async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;
        const respondents = await prisma.respondent.findMany({where: {groupId}});

        return res.status(200).json(respondents);
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/createRespondent', [
    body('name')
      .trim()
      .notEmpty()
      .isString()
      .isLength({max: 70})
      .withMessage("Enter a non-empty string of length not exceeding 70 chars"),
    body('email')
      .trim()
      .isEmail()
      .withMessage("Please enter a valid Email ID")
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }

        const {name, email, groupId} = req.body;
        const respondent = await prisma.respondent.create({data: {name, email, groupId}});

        return res.status(201).json(respondent);
    } 
    catch (err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.delete('/deleteRespondent/:respondentId', async (req: Request, res: Response) => {
    try {
        const { respondentId } = req.params;
        await prisma.respondent.delete({where: {id: respondentId}});

        return res.status(200).json({message: "Respondent deleted successfully"});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;
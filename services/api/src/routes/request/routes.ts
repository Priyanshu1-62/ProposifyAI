import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';

const router = Router();

router.get('/getRequest/:requestId', async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        const newRequest = await prisma.request.findUnique({where: {id: requestId}});

        if(!newRequest){
            return res.status(404).json({message: "request Not Found"});
        }
        return res.status(200).json(newRequest);
        
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getRequests/:userId', async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const requests = await prisma.request.findMany({where: {userId}});

        return res.status(200).json(requests);
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.post('/createRequest', [
    body('title')
      .trim()
      .notEmpty()
      .isString()
      .isLength({max: 70})
      .withMessage("Enter a non-empty string of length not exceeding 70 chars"),
    body('description')
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Enter a valid non-empty string"),
    body('respondentGroupId')
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Enter a valid request Id"),
    body('userId')
        .trim()
        .notEmpty()
        .isString()
        .withMessage("Enter a valid User Id")
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }

        const {title, description, userId, respondentGroupId} = req.body;
        const newRequest = await prisma.request.create({data: {title, description, userId, respondentGroupId}});

        return res.status(201).json(newRequest);
    } 
    catch (err) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.put('/updateRequest', [], async (req: Request, res: Response) => {
    try {
        const { requestId, status } = req.body;
        const updatedRequest = await prisma.request.update({where: {id: requestId}, data: {status}});

        return res.status(200).json(updatedRequest);
        
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.delete('/deleteRequest/:requestId', async (req: Request, res: Response) => {
    try {
        const { requestId } = req.params;
        await prisma.request.delete({where: {id: requestId}});

        res.status(200).json({message: "Request deleted"});
        
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

export default router;
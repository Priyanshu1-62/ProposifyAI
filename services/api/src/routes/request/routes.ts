import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';

const router = Router();

const superuserId = process.env.SUPERUSER_ID!;

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

router.get('/getRequests/', [], async (req: Request, res: Response) => {
    try {

        //update this for multi user model
        let userId = superuserId;

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
      .notEmpty().withMessage("Title cannot be empty")
      .isString().withMessage("Please enter a valid string for Title")
      .isLength({max: 70}).withMessage("Title length cannot exceed 70 characters")
      .bail(),
    body('description')
        .trim()
        .notEmpty().withMessage("Description cannot be empty")
        .isString().withMessage("Please enter a valid string for description")
        .bail(),
    body('respondentGroupId')
        .trim()
        .notEmpty().withMessage("You must select a respondent group")
        .isString().withMessage("Invalid group")
        .bail(),
    body('userId')
        .trim()
        .notEmpty().withMessage("No user data found. Please login")
        .isString().withMessage("Invalid User Id, please login")
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }

        let {title, description, userId, respondentGroupId} = req.body;

        //update this for multi user model
        userId = superuserId;
        
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
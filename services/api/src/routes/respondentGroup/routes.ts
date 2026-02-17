import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { body, validationResult } from 'express-validator';
import { authTokenVerification } from "../../middlewares/authTokenVerification";

const router = Router();

router.get('/getGroup/:groupId', authTokenVerification, async (req: Request, res: Response) => { //First check if user is owner of the resource
    try {
        const { groupId } = req.params;
        const group = await prisma.respondentGroup.findUnique({where: {id: groupId}});

        if(!group){
            return res.status(404).json({message: "Group Not Found"});
        }
        return res.status(200).json({group: group});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.get('/getGroups', authTokenVerification, async (req: Request, res: Response) => {
    try {
        let userId = req.userId;

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
      .notEmpty().withMessage("Group name cannot be empty")
      .isString().withMessage("Enter a valid string")
      .isLength({max: 70}).withMessage('Maximum number of allowed characters is 70')
], authTokenVerification, async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error : errors.array()[0].msg});
        }

        let { name } = req.body as { name: string };
        let userId = req.userId;
        if(!userId){
            return res.status(401).json({message: "No user found"});
        }

        const existingGroup = await prisma.respondentGroup.findUnique({where: {userId_name: {userId, name}}});
        if(existingGroup){
            return res.status(409).json({message: "A group with same name already exist !!"});
        }
        
        const newGroup = await prisma.respondentGroup.create({data: {name, userId}});

        return res.status(201).json({group: newGroup});
    } 
    catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

router.delete('/deleteGroup/:groupId', authTokenVerification, async (req: Request, res: Response) => { //First check if user is owner of the resource
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
import prisma from "../../lib/prisma";
import { createUserBody } from "../../types/userInterface/createUserBody";

export async function createUser(data: createUserBody){
    try {
        const newUser = await prisma.user.create({data});
        return newUser;
    } 
    catch (error) {
        throw error;
    }
}
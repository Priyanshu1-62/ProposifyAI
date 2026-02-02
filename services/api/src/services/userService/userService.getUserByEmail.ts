import prisma from "../../lib/prisma";

export async function getUserByEmail(email: string){
    try {
        const existingUser = await prisma.user.findFirst({where: {email}});
        return existingUser;
    } 
    catch (error) {
        throw error;
    }
}
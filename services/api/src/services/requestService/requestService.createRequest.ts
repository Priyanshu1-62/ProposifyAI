import prisma from "../../lib/prisma";
import { requestBody } from "../../types/requestInterface/requestBody";

export async  function createRequest(userId: string, reqBody: requestBody){
    try {
        const result = await prisma.request.create({
            data: {
                title: reqBody.title,
                description: reqBody.description,
                user: { connect: { id: userId } },
                respondentGroup: { connect: { id: reqBody.respondentGroupId } }
            }
        });
        return result;
    } 
    catch (error) {
        throw error;
    }
}
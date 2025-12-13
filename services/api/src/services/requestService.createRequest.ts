import prisma from "../lib/prisma";
import { requestBody } from "../types/requestBody";

export async  function createRequest(data: requestBody){
    try {
        const result = await prisma.request.create({data});
        return result;
    } 
    catch (error) {
        throw error;
    }
}
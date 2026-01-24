import prisma from "../../lib/prisma";
import { respondentUpdateData } from "../../types/respondentInterface/respondentUpdateData";

export async function updateRespondent(email: string, groupId: string, data: respondentUpdateData){
    try {
        const updatedRespondent = await prisma.respondent.update({where: {email_groupId: {email, groupId}}, data});    
        return updatedRespondent;
    } 
    catch (error) {
        throw error;
    }
}
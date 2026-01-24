import prisma from "../../lib/prisma";

export async function getRespondents(groupId: string){
    try {
        const respondents = await prisma.respondent.findMany({
            where: {groupId},
            select: {
                id: true,                       
                name: true,                     
                email: true,                    
                createdAt: true,               
                outboundStatus: true,           
                inboundStatus: true,            
                inboundEvaluationStatus: true,     
                groupId: false           
            }
        });
        return respondents;
    } 
    catch (error) {
        throw error;
    }
}
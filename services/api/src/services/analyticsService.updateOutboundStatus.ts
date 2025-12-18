import { OutboundEmailStatus } from "@prisma/client";
import prisma from "../lib/prisma";

export async function updateOutboundStatus(id: string, status: OutboundEmailStatus){
    try {
        await prisma.outboundEmail.update({where: {id}, data: {status}});
    } 
    catch (error) {
        throw error;
    }
}
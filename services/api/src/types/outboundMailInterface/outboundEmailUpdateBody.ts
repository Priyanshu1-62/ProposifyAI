import { OutboundEmailStatus } from "@prisma/client";

export interface outboundEmailupdateBody {
    status?: OutboundEmailStatus
    current_status?: OutboundEmailStatus
}
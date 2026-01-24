import { InboundEmailStatus, InboundEvaluationStatus, OutboundEmailStatus } from "@prisma/client";

export interface respondentUpdateData {
    outboundStatus?: OutboundEmailStatus;
    inboundStatus?: InboundEmailStatus;
    inboundEvaluationStatus?: InboundEvaluationStatus;
}
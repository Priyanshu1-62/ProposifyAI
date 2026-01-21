import { EmailEventType } from "@prisma/client";
import { requestOverviewIncKeys } from "../types/requestInterface/requestOverviewIncKeys";

const eventCounterFunction: Partial<Record<EmailEventType, requestOverviewIncKeys>> = {
    "BOUNCED": "outboundMailBouncedCount",
    "COMPLAINED": "outboundMailComplainedCount",
    "DELIVERED": "outboundMailDeliveredCount",
}

export default eventCounterFunction;
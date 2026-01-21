import { RequestOverviewStatus } from "@prisma/client"
import { requestOverviewIncKeys } from "./requestOverviewIncKeys";

type requestOverviewDataIncFields = Partial<Record<requestOverviewIncKeys, Record<"increment", number>>>;

export interface requestOverviewData extends requestOverviewDataIncFields {
    requestId?:                    string;
    respondentGroupIdd?:           string;
    aiRequestProfileId?:           string;
    status?:                       RequestOverviewStatus;
    lastUpdatedAt?:                Date;
    lastOutboundMailTimeStamp?:    Date;
    lastInboundMailTimeStamp?:     Date;
}
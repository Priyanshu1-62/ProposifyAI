import { RequestOverviewStatus } from "@prisma/client"

export interface requestOverviewBody {
    requestId?:               string
    respondentGroupIdd?:      string
    outboundEmailId?:         string
    inboundMessageId?:        string
    aiRequestProfileId?:      string
    aiResponseEvaluationId?:  string
    status?:                  RequestOverviewStatus
    lastUpdatedAt?:           Date
}
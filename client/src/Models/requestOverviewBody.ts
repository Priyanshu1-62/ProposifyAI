import type { requestOverviewStatus } from "./requestOverviewStatus";

export interface requestOverviewBody {

  id:                          string  
  createdAt:                    string
     
  requestId:                    string 
  title:                        string
  description:                  string
  respondentGroupId :           string
  aiRequestProfileId?:          string

  outboundMailSentCount:        number
  outboundMailFailedCount:      number
  outboundMailBouncedCount:     number
  outboundMailComplainedCount:  number
  outboundMailDeliveredCount:   number
  lastOutboundMailTimeStamp?:   string

  inboundMailCount:             number
  lastInboundMailTimeStamp?:    string

  status:                       requestOverviewStatus
  lastUpdatedAt:                string

  userId:                       string
}
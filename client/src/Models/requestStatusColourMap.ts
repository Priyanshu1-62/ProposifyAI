import type { requestOverviewStatus } from "./requestOverviewStatus";

export const requestStatusColourMap: Record<requestOverviewStatus, string> = {
  "DRAFT": "bg-emerald-500",
  "CREATED": "bg-emerald-500",
  "PROCESSING": "bg-emerald-500",
  "OUTBOUND_FAILED": "bg-emerald-500",
  "EMAILS_SENT": "bg-emerald-500",
  "AWAITING_RESPONSES": "bg-emerald-500",
  "RESPONSES_RECEIVED": "bg-emerald-500",
  "EVALUATING": "bg-emerald-500",
  "EVALUATION_FAILED": "bg-emerald-500",
  "COMPLETED": "bg-emerald-500",
  "CLOSED": "bg-emerald-500"
};
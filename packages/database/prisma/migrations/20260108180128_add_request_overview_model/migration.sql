-- CreateEnum
CREATE TYPE "RequestOverviewStatus" AS ENUM ('DRAFT', 'FAILED', 'SENT', 'EVALUATED', 'COMPLETED');

-- CreateTable
CREATE TABLE "RequestOverview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "respondentGroupId" TEXT NOT NULL,
    "OutboundEmailAttemptId" TEXT,
    "outboundEmailId" TEXT,
    "inboundMessageId" TEXT,
    "aiRequestProfileId" TEXT,
    "aiResponseEvaluationId" TEXT,
    "status" "RequestOverviewStatus" NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestOverview_pkey" PRIMARY KEY ("id")
);

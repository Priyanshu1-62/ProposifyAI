/*
  Warnings:

  - Changed the type of `eventType` on the `OutboundEmailEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmailEventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'FAILED');

-- CreateEnum
CREATE TYPE "OutboundEmailAttemptStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "OutboundEmailFailureReason" AS ENUM ('PROVIDER_ERROR', 'RATE_LIMITED', 'NETWORK_ERROR', 'USER_CANCELLED', 'UNKNOWN');

-- AlterTable
ALTER TABLE "OutboundEmailEvent" DROP COLUMN "eventType",
ADD COLUMN     "eventType" "EmailEventType" NOT NULL;

-- DropEnum
DROP TYPE "ResendEmailEventType";

-- CreateTable
CREATE TABLE "OutboundEmailAttempt" (
    "id" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT,
    "requestId" TEXT NOT NULL,
    "respondentGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "OutboundEmailAttemptStatus" NOT NULL,
    "failureReason" "OutboundEmailFailureReason",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outboundEmailId" TEXT,

    CONSTRAINT "OutboundEmailAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboundEmailAttempt_userId_idx" ON "OutboundEmailAttempt"("userId");

-- CreateIndex
CREATE INDEX "OutboundEmailAttempt_requestId_idx" ON "OutboundEmailAttempt"("requestId");

-- CreateIndex
CREATE INDEX "OutboundEmailAttempt_respondentGroupId_idx" ON "OutboundEmailAttempt"("respondentGroupId");

-- AddForeignKey
ALTER TABLE "OutboundEmailAttempt" ADD CONSTRAINT "OutboundEmailAttempt_outboundEmailId_fkey" FOREIGN KEY ("outboundEmailId") REFERENCES "OutboundEmail"("id") ON DELETE SET NULL ON UPDATE CASCADE;

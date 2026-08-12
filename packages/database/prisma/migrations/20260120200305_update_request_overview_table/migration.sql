/*
  Warnings:

  - You are about to drop the column `OutboundEmailAttemptId` on the `RequestOverview` table. All the data in the column will be lost.
  - You are about to drop the column `aiResponseEvaluationId` on the `RequestOverview` table. All the data in the column will be lost.
  - You are about to drop the column `inboundMessageId` on the `RequestOverview` table. All the data in the column will be lost.
  - You are about to drop the column `outboundEmailId` on the `RequestOverview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RequestOverview" DROP COLUMN "OutboundEmailAttemptId",
DROP COLUMN "aiResponseEvaluationId",
DROP COLUMN "inboundMessageId",
DROP COLUMN "outboundEmailId",
ADD COLUMN     "inboundMailCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastInboundMailTimeStamp" TIMESTAMP(3),
ADD COLUMN     "lastOutboundMailTimeStamp" TIMESTAMP(3),
ADD COLUMN     "outboundMailBouncedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outboundMailComplainedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outboundMailDeliveredCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outboundMailFailedCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "outboundMailSentCount" INTEGER NOT NULL DEFAULT 0;

/*
  Warnings:

  - You are about to drop the column `inboundReceived` on the `Respondent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OutboundEmailAttempt" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Respondent" DROP COLUMN "inboundReceived",
ADD COLUMN     "inboundStatus" "InboundEmailStatus" NOT NULL DEFAULT 'WAITING',
ALTER COLUMN "inboundEvaluationStatus" SET DEFAULT 'PENDING',
ALTER COLUMN "outboundStatus" SET DEFAULT 'PENDING';

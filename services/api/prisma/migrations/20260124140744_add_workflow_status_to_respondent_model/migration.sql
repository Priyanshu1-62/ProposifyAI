-- CreateEnum
CREATE TYPE "InboundEvaluationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILURE');

-- AlterTable
ALTER TABLE "OutboundEmailAttempt" ALTER COLUMN "status" SET DEFAULT 'FAILED';

-- AlterTable
ALTER TABLE "Respondent" ADD COLUMN     "inboundEvaluationStatus" "InboundEvaluationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "inboundReceived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "outboundStatus" "OutboundEmailStatus" NOT NULL DEFAULT 'FAILED';

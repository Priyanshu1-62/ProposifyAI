/*
  Warnings:

  - The values [FAILURE] on the enum `InboundEvaluationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `inboundReceived` on the `Respondent` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InboundEmailStatus" AS ENUM ('WAITING', 'RECEIVED');

-- AlterEnum
BEGIN;
CREATE TYPE "InboundEvaluationStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
ALTER TABLE "public"."Respondent" ALTER COLUMN "inboundEvaluationStatus" DROP DEFAULT;
ALTER TABLE "Respondent" ALTER COLUMN "inboundEvaluationStatus" TYPE "InboundEvaluationStatus_new" USING ("inboundEvaluationStatus"::text::"InboundEvaluationStatus_new");
ALTER TYPE "InboundEvaluationStatus" RENAME TO "InboundEvaluationStatus_old";
ALTER TYPE "InboundEvaluationStatus_new" RENAME TO "InboundEvaluationStatus";
DROP TYPE "public"."InboundEvaluationStatus_old";
-- ALTER TABLE "Respondent" ALTER COLUMN "inboundEvaluationStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
ALTER TYPE "OutboundEmailAttemptStatus" ADD VALUE 'PENDING';

-- AlterEnum
ALTER TYPE "OutboundEmailStatus" ADD VALUE 'PENDING';

-- AlterTable
-- ALTER TABLE "OutboundEmailAttempt" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
-- ALTER TABLE "Respondent" DROP COLUMN "inboundReceived",
-- ADD COLUMN     "inboundStatus" "InboundEmailStatus" NOT NULL DEFAULT 'WAITING',
-- ALTER COLUMN "outboundStatus" SET DEFAULT 'PENDING';

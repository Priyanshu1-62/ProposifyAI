/*
  Warnings:

  - The values [FAILED,SENT,EVALUATED] on the enum `RequestOverviewStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestOverviewStatus_new" AS ENUM ('DRAFT', 'CREATED', 'PROCESSING', 'OUTBOUND_FAILED', 'EMAILS_SENT', 'AWAITING_RESPONSES', 'RESPONSES_RECEIVED', 'EVALUATING', 'EVALUATION_FAILED', 'COMPLETED', 'CLOSED');
ALTER TABLE "RequestOverview" ALTER COLUMN "status" TYPE "RequestOverviewStatus_new" USING ("status"::text::"RequestOverviewStatus_new");
ALTER TYPE "RequestOverviewStatus" RENAME TO "RequestOverviewStatus_old";
ALTER TYPE "RequestOverviewStatus_new" RENAME TO "RequestOverviewStatus";
DROP TYPE "public"."RequestOverviewStatus_old";
COMMIT;

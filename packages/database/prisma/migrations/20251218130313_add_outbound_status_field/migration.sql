/*
  Warnings:

  - The values [RECEIVED] on the enum `EmailEventType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `occuredAt` on the `OutboundEmailEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[outboundEmailId,eventType]` on the table `OutboundEmailEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `OutboundEmail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occurredAt` to the `OutboundEmailEvent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OutboundEmailStatus" AS ENUM ('SENT', 'FAILED', 'BOUNCED', 'COMPLAINED', 'DELIVERED');

-- AlterEnum
BEGIN;
CREATE TYPE "EmailEventType_new" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'FAILED');
ALTER TABLE "OutboundEmailEvent" ALTER COLUMN "eventType" TYPE "EmailEventType_new" USING ("eventType"::text::"EmailEventType_new");
ALTER TYPE "EmailEventType" RENAME TO "EmailEventType_old";
ALTER TYPE "EmailEventType_new" RENAME TO "EmailEventType";
DROP TYPE "public"."EmailEventType_old";
COMMIT;

-- AlterTable
ALTER TABLE "OutboundEmail" ADD COLUMN     "status" "OutboundEmailStatus" NOT NULL;

-- AlterTable
ALTER TABLE "OutboundEmailEvent" DROP COLUMN "occuredAt",
ADD COLUMN     "occurredAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payload" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmailEvent_outboundEmailId_eventType_key" ON "OutboundEmailEvent"("outboundEmailId", "eventType");

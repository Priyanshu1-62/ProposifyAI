/*
  Warnings:

  - Changed the type of `eventType` on the `OutboundEmailEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OutboundEmailEvent" DROP COLUMN "eventType",
ADD COLUMN     "eventType" "OutboundEmailStatus" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmailEvent_outboundEmailId_eventType_key" ON "OutboundEmailEvent"("outboundEmailId", "eventType");

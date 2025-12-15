/*
  Warnings:

  - You are about to drop the column `ResendMessageId` on the `OutboundEmail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resendMessageId]` on the table `OutboundEmail` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resendMessageId` to the `OutboundEmail` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "OutboundEmail_ResendMessageId_key";

-- AlterTable
ALTER TABLE "OutboundEmail" DROP COLUMN "ResendMessageId",
ADD COLUMN     "resendMessageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmail_resendMessageId_key" ON "OutboundEmail"("resendMessageId");

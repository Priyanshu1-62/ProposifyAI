/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `InboundMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `messageId` to the `InboundMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InboundMessage" ADD COLUMN     "messageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "InboundMessage_messageId_key" ON "InboundMessage"("messageId");

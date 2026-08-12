/*
  Warnings:

  - A unique constraint covering the columns `[requestId,from]` on the table `InboundMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "InboundMessage_requestId_from_idx" ON "InboundMessage"("requestId", "from");

-- CreateIndex
CREATE UNIQUE INDEX "InboundMessage_requestId_from_key" ON "InboundMessage"("requestId", "from");

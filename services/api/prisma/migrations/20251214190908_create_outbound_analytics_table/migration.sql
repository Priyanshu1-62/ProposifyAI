-- CreateEnum
CREATE TYPE "ResendEmailEventType" AS ENUM ('SENT', 'DELIVERED', 'OPENED', 'CLICKED', 'BOUNCED', 'COMPLAINED', 'FAILED');

-- CreateTable
CREATE TABLE "OutboundEmail" (
    "id" TEXT NOT NULL,
    "ResendMessageId" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT,
    "requestId" TEXT NOT NULL,
    "respondentGroupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboundEmailEvent" (
    "id" TEXT NOT NULL,
    "eventType" "ResendEmailEventType" NOT NULL,
    "occuredAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outboundEmailId" TEXT NOT NULL,

    CONSTRAINT "OutboundEmailEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OutboundEmail_ResendMessageId_key" ON "OutboundEmail"("ResendMessageId");

-- CreateIndex
CREATE INDEX "OutboundEmail_userId_idx" ON "OutboundEmail"("userId");

-- CreateIndex
CREATE INDEX "OutboundEmail_requestId_idx" ON "OutboundEmail"("requestId");

-- CreateIndex
CREATE INDEX "OutboundEmail_respondentGroupId_idx" ON "OutboundEmail"("respondentGroupId");

-- AddForeignKey
ALTER TABLE "OutboundEmailEvent" ADD CONSTRAINT "OutboundEmailEvent_outboundEmailId_fkey" FOREIGN KEY ("outboundEmailId") REFERENCES "OutboundEmail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

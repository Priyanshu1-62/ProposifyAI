/*
  Warnings:

  - You are about to drop the column `html` on the `InboundMessage` table. All the data in the column will be lost.
  - You are about to drop the column `respondentMessageId` on the `InboundMessage` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `InboundMessage` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `InboundMessage` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RespondentMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `from` to the `InboundMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestId` to the `InboundMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_inboundMessageId_fkey";

-- DropForeignKey
ALTER TABLE "InboundMessage" DROP CONSTRAINT "InboundMessage_respondentMessageId_fkey";

-- DropForeignKey
ALTER TABLE "RespondentMessage" DROP CONSTRAINT "RespondentMessage_requestId_fkey";

-- AlterTable
ALTER TABLE "InboundMessage" DROP COLUMN "html",
DROP COLUMN "respondentMessageId",
DROP COLUMN "subject",
DROP COLUMN "text",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "requestId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "RespondentMessage";

-- CreateTable
CREATE TABLE "InboundMessageContent" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "text" TEXT,
    "html" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inboundMessageId" TEXT NOT NULL,

    CONSTRAINT "InboundMessageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundMessageAttachment" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inboundMessageId" TEXT NOT NULL,

    CONSTRAINT "InboundMessageAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InboundMessage" ADD CONSTRAINT "InboundMessage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundMessageContent" ADD CONSTRAINT "InboundMessageContent_inboundMessageId_fkey" FOREIGN KEY ("inboundMessageId") REFERENCES "InboundMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InboundMessageAttachment" ADD CONSTRAINT "InboundMessageAttachment_inboundMessageId_fkey" FOREIGN KEY ("inboundMessageId") REFERENCES "InboundMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `aiModel` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `aiSummary` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `RespondentResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RespondentResponse" DROP CONSTRAINT "RespondentResponse_requestId_fkey";

-- DropForeignKey
ALTER TABLE "RespondentResponse" DROP CONSTRAINT "RespondentResponse_respondentId_fkey";

-- AlterTable
ALTER TABLE "InboundMessage" ADD COLUMN     "aiResponseEvaluationId" TEXT;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "aiModel",
DROP COLUMN "aiSummary",
DROP COLUMN "status",
ADD COLUMN     "aiRequestProfileId" TEXT;

-- DropTable
DROP TABLE "RespondentResponse";

-- CreateTable
CREATE TABLE "AIRequestProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiModel" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "scoringCriteria" JSONB NOT NULL,
    "requestId" TEXT NOT NULL,

    CONSTRAINT "AIRequestProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIResponseEvaluation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aiModel" TEXT NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "scoreBreakdown" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "aiExplanation" TEXT NOT NULL,
    "inboundMessageId" TEXT NOT NULL,

    CONSTRAINT "AIResponseEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIRequestProfile_requestId_key" ON "AIRequestProfile"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "AIResponseEvaluation_inboundMessageId_key" ON "AIResponseEvaluation"("inboundMessageId");

-- AddForeignKey
ALTER TABLE "AIRequestProfile" ADD CONSTRAINT "AIRequestProfile_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIResponseEvaluation" ADD CONSTRAINT "AIResponseEvaluation_inboundMessageId_fkey" FOREIGN KEY ("inboundMessageId") REFERENCES "InboundMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

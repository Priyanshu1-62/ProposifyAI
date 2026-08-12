/*
  Warnings:

  - You are about to drop the column `aiExplanation` on the `AIResponseEvaluation` table. All the data in the column will be lost.
  - Added the required column `scoringExplanation` to the `AIResponseEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIResponseEvaluation" DROP COLUMN "aiExplanation",
ADD COLUMN     "scoringExplanation" TEXT NOT NULL;

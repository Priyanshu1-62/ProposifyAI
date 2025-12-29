/*
  Warnings:

  - Made the column `outputSchema` on table `PromptProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PromptProfile" ALTER COLUMN "outputSchema" SET NOT NULL;

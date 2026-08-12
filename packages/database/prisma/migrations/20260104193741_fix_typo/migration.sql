/*
  Warnings:

  - You are about to drop the column `prupose` on the `PromptProfile` table. All the data in the column will be lost.
  - Added the required column `purpose` to the `PromptProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptProfile" DROP COLUMN "prupose",
ADD COLUMN     "purpose" TEXT NOT NULL;

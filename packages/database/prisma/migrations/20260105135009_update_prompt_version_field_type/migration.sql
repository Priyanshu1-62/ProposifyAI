/*
  Warnings:

  - Changed the type of `promptVersion` on the `AIRequestProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AIRequestProfile" DROP COLUMN "promptVersion",
ADD COLUMN     "promptVersion" INTEGER NOT NULL;

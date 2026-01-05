/*
  Warnings:

  - You are about to drop the column `prompt` on the `PromptProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key,version]` on the table `PromptProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `systemPrompt` to the `PromptProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PromptProfile" DROP COLUMN "prompt",
ADD COLUMN     "systemPrompt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PromptProfile_key_version_key" ON "PromptProfile"("key", "version");

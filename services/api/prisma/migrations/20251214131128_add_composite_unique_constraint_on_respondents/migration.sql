/*
  Warnings:

  - A unique constraint covering the columns `[email,groupId]` on the table `Respondent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Respondent_email_groupId_key" ON "Respondent"("email", "groupId");

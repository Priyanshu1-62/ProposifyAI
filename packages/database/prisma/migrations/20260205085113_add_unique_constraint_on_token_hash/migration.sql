/*
  Warnings:

  - A unique constraint covering the columns `[tokenHash]` on the table `RefreshTokenVault` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokenVault_tokenHash_key" ON "RefreshTokenVault"("tokenHash");

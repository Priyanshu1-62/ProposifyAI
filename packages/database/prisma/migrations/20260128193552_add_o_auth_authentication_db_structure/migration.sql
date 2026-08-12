/*
  Warnings:

  - You are about to drop the column `isSubscribed` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionExpiry` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OAuthProvider" AS ENUM ('GOOGLE', 'GITHUB', 'MICROSOFT');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isSubscribed",
DROP COLUMN "plan",
DROP COLUMN "subscriptionExpiry",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OAuthUserProfile" (
    "id" TEXT NOT NULL,
    "provider" "OAuthProvider" NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OAuthUserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OAuthUserProfile_provider_providerUserId_key" ON "OAuthUserProfile"("provider", "providerUserId");

-- AddForeignKey
ALTER TABLE "OAuthUserProfile" ADD CONSTRAINT "OAuthUserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

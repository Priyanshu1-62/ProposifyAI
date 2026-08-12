/*
  Warnings:

  - Added the required column `current_status` to the `OutboundEmail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OutboundEmail" ADD COLUMN     "current_status" "OutboundEmailStatus" NOT NULL;

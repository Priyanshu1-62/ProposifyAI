/*
  Warnings:

  - Changed the type of `current_status` on the `OutboundEmail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "OutboundEmail" DROP COLUMN "current_status",
ADD COLUMN     "current_status" "OutboundEmailStatus" NOT NULL;

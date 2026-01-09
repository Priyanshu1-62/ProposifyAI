/*
  Warnings:

  - A unique constraint covering the columns `[requestId]` on the table `RequestOverview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RequestOverview_requestId_key" ON "RequestOverview"("requestId");

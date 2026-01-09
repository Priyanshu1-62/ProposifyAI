-- AddForeignKey
ALTER TABLE "RequestOverview" ADD CONSTRAINT "RequestOverview_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

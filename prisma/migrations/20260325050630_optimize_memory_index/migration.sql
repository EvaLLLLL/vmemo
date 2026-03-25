-- DropIndex
DROP INDEX "Memory_userId_nextReviewDate_idx";

-- CreateIndex
CREATE INDEX "Memory_userId_status_nextReviewDate_idx" ON "Memory"("userId", "status", "nextReviewDate");

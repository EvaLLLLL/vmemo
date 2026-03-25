-- CreateIndex
CREATE INDEX "Memory_userId_idx" ON "Memory"("userId");

-- CreateIndex
CREATE INDEX "Memory_userId_nextReviewDate_idx" ON "Memory"("userId", "nextReviewDate");

-- CreateIndex
CREATE INDEX "ReviewSession_userId_idx" ON "ReviewSession"("userId");

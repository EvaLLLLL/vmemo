/*
  Warnings:

  - You are about to drop the column `vocabularyId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_vocabularyId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "vocabularyId";

-- CreateTable
CREATE TABLE "ReviewSession" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewSessionItem" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "vocabularyId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewSessionItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewSession" ADD CONSTRAINT "ReviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSessionItem" ADD CONSTRAINT "ReviewSessionItem_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ReviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewSessionItem" ADD CONSTRAINT "ReviewSessionItem_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

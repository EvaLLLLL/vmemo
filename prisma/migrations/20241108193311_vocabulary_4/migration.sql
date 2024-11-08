/*
  Warnings:

  - You are about to drop the column `userId` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vocabulary" DROP CONSTRAINT "Vocabulary_userId_fkey";

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_UserToVocabulary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVocabulary_AB_unique" ON "_UserToVocabulary"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVocabulary_B_index" ON "_UserToVocabulary"("B");

-- AddForeignKey
ALTER TABLE "_UserToVocabulary" ADD CONSTRAINT "_UserToVocabulary_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVocabulary" ADD CONSTRAINT "_UserToVocabulary_B_fkey" FOREIGN KEY ("B") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

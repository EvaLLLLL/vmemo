-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_vocabularyId_fkey";

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

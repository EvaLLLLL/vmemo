/*
  Warnings:

  - The `level` column on the `Memory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `audio` on the `Vocabulary` table. All the data in the column will be lost.
  - You are about to drop the `Ecdict` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,vocabularyId]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `translation` on table `Vocabulary` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MemoryStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "MemoryLevel" AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'MASTERED');

-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "lastReviewedAt" TIMESTAMP(3),
ADD COLUMN     "nextReviewDate" TIMESTAMP(3),
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "MemoryStatus" NOT NULL DEFAULT 'NOT_STARTED',
DROP COLUMN "level",
ADD COLUMN     "level" "MemoryLevel" NOT NULL DEFAULT 'LEVEL_1';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" VARCHAR(255);

-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "audio",
ALTER COLUMN "translation" SET NOT NULL;

-- DropTable
DROP TABLE "Ecdict";

-- CreateIndex
CREATE UNIQUE INDEX "Memory_userId_vocabularyId_key" ON "Memory"("userId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- RenameIndex
ALTER INDEX "constraint_name" RENAME TO "Vocabulary_origin_key";

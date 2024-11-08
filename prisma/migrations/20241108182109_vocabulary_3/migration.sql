/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Vocabulary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vocabulary" DROP COLUMN "audioUrl",
ADD COLUMN     "audio" TEXT;

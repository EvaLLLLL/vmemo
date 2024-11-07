/*
  Warnings:

  - A unique constraint covering the columns `[origin]` on the table `Vocabulary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Ecdict" (
    "word" TEXT NOT NULL,
    "phonetic" TEXT,
    "definition" TEXT,
    "translation" TEXT,
    "pos" TEXT,
    "collins" TEXT,
    "oxford" TEXT,
    "tag" TEXT,
    "bnc" TEXT,
    "frq" TEXT,
    "exchange" TEXT,
    "detail" TEXT,
    "audio" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Ecdict_word_key" ON "Ecdict"("word");

-- CreateIndex
CREATE UNIQUE INDEX "constraint_name" ON "Vocabulary"("origin");

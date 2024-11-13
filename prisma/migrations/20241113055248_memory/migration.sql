-- CreateTable
CREATE TABLE "Memory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "vocabularyId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "rawid" SERIAL NOT NULL,
    "flavor" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "arguments" TEXT NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("rawid")
);

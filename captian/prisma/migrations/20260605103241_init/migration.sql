/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "BlackListToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlackListToken_id_key" ON "BlackListToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

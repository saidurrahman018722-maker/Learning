-- AlterTable
ALTER TABLE "BlackListToken" ADD CONSTRAINT "BlackListToken_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "BlackListToken_id_key";

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "User_id_key";

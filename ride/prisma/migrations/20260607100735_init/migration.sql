/*
  Warnings:

  - You are about to drop the column `captainId` on the `Ride` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ride_captainId_key";

-- DropIndex
DROP INDEX "Ride_userId_key";

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "captainId";

-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "captainId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "pickup" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ride_userId_key" ON "Ride"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ride_captainId_key" ON "Ride"("captainId");

/*
  Warnings:

  - A unique constraint covering the columns `[createdById]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_createdById_key" ON "Room"("createdById");

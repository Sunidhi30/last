/*
  Warnings:

  - A unique constraint covering the columns `[phonenumber]` on the table `Voter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voter_phonenumber_key" ON "Voter"("phonenumber");

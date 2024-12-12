/*
  Warnings:

  - You are about to drop the column `isregister` on the `Voter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadharno]` on the table `Voter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Voter" DROP COLUMN "isregister",
ADD COLUMN     "isvoted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Voter_aadharno_key" ON "Voter"("aadharno");

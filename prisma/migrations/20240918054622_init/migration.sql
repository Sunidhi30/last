-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "voterid" INTEGER NOT NULL,
    "token" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_id_key" ON "Token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_voterid_key" ON "Token"("voterid");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_voterid_fkey" FOREIGN KEY ("voterid") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

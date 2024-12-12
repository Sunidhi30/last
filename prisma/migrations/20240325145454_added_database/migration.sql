-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "nationality" TEXT NOT NULL,
    "partyname" TEXT NOT NULL,
    "partylogo" TEXT NOT NULL,
    "totalvotes" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Votes" (
    "id" SERIAL NOT NULL,
    "voterid" INTEGER NOT NULL,
    "candidateid" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Voter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "phonenumber" TEXT NOT NULL,
    "aadharno" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "isregister" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_id_key" ON "Candidate"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_id_key" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_id_key" ON "Votes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Votes_voterid_key" ON "Votes"("voterid");

-- CreateIndex
CREATE UNIQUE INDEX "Voter_id_key" ON "Voter"("id");

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_voterid_fkey" FOREIGN KEY ("voterid") REFERENCES "Voter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Votes" ADD CONSTRAINT "Votes_candidateid_fkey" FOREIGN KEY ("candidateid") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Msgadmin" (
    "id" SERIAL NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "Msgadmin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Msgadmin" ADD CONSTRAINT "Msgadmin_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

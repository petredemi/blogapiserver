-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blogauthor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestauth" BOOLEAN NOT NULL DEFAULT false;

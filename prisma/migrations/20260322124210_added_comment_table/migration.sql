-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "picture" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" TEXT;

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

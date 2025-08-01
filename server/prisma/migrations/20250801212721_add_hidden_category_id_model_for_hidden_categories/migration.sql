/*
  Warnings:

  - You are about to drop the column `isHidden` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "isHidden";

-- CreateTable
CREATE TABLE "HiddenCategory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "HiddenCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HiddenCategory" ADD CONSTRAINT "HiddenCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `_TransactionTags` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `userId` on table `Payee` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Tag` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Payee" DROP CONSTRAINT "Payee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_userId_fkey";

-- DropForeignKey
ALTER TABLE "_TransactionTags" DROP CONSTRAINT "_TransactionTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_TransactionTags" DROP CONSTRAINT "_TransactionTags_B_fkey";

-- AlterTable
ALTER TABLE "Payee" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tag" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "tagId" INTEGER;

-- DropTable
DROP TABLE "_TransactionTags";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payee" ADD CONSTRAINT "Payee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

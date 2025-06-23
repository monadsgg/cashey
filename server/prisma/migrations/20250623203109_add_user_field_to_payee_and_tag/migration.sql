/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Payee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Payee_name_key";

-- DropIndex
DROP INDEX "Tag_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Payee_name_userId_key" ON "Payee"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");

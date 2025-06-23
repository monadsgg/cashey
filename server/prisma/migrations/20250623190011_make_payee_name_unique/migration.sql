/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Payee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Payee_name_key" ON "Payee"("name");

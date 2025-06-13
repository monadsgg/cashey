/*
  Warnings:

  - A unique constraint covering the columns `[walletId]` on the table `SavingAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SavingAccount_walletId_key" ON "SavingAccount"("walletId");

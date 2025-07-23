/*
  Warnings:

  - You are about to drop the `SavingAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavingAccount" DROP CONSTRAINT "SavingAccount_walletId_fkey";

-- DropTable
DROP TABLE "SavingAccount";

-- CreateTable
CREATE TABLE "Account" (
    "walletId" INTEGER NOT NULL,
    "targetAmt" DECIMAL(12,2),
    "owner" TEXT,
    "accountType" TEXT NOT NULL,
    "investmentType" TEXT,
    "contributionLimit" DECIMAL(12,2),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("walletId")
);

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

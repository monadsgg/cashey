/*
  Warnings:

  - You are about to drop the `Savings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Savings" DROP CONSTRAINT "Savings_userId_fkey";

-- DropForeignKey
ALTER TABLE "Savings" DROP CONSTRAINT "Savings_walletId_fkey";

-- DropTable
DROP TABLE "Savings";

-- CreateTable
CREATE TABLE "SavingAccount" (
    "id" SERIAL NOT NULL,
    "walletId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "currentAmt" DECIMAL(12,2) NOT NULL,
    "targetAmt" DECIMAL(12,2) NOT NULL,
    "accountType" TEXT,
    "owner" TEXT,
    "contributionLimit" TEXT,

    CONSTRAINT "SavingAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

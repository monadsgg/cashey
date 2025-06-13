-- DropForeignKey
ALTER TABLE "SavingAccount" DROP CONSTRAINT "SavingAccount_walletId_fkey";

-- AddForeignKey
ALTER TABLE "SavingAccount" ADD CONSTRAINT "SavingAccount_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

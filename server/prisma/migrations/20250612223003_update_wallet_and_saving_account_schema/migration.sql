/*
  Warnings:

  - The primary key for the `SavingAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `currentAmt` on the `SavingAccount` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SavingAccount` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SavingAccount` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `SavingAccount` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `SavingAccount` table. All the data in the column will be lost.
  - Made the column `accountType` on table `SavingAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SavingAccount" DROP CONSTRAINT "SavingAccount_userId_fkey";

-- DropIndex
DROP INDEX "SavingAccount_walletId_key";

-- AlterTable
ALTER TABLE "SavingAccount" DROP CONSTRAINT "SavingAccount_pkey",
DROP COLUMN "currentAmt",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "investmentType" TEXT,
ALTER COLUMN "accountType" SET NOT NULL,
ADD CONSTRAINT "SavingAccount_pkey" PRIMARY KEY ("walletId");

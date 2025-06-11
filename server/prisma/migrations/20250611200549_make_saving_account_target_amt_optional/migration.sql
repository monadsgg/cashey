/*
  Warnings:

  - The `contributionLimit` column on the `SavingAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SavingAccount" DROP COLUMN "contributionLimit",
ADD COLUMN     "contributionLimit" DECIMAL(12,2);

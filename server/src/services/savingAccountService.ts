import db from '../utils/db';
import { InvestmentAccountType, SavingType, WalletType } from '../utils/enums';

interface SavingAccountInput {
  name: string;
  type: SavingType.PERSONAL | SavingType.INVESTMENT;
  currentAmt: number;
  targetAmt?: number;
  owner?: string;
  accountType?:
    | InvestmentAccountType.TFSA
    | InvestmentAccountType.RRSP
    | InvestmentAccountType.FHSA;
  contributionLimit?: number;
}

export async function getAllSavings(userId: number) {
  const savingAccounts = await db.savingAccount.findMany({ where: { userId } });
  return savingAccounts;
}

export async function addSavingAccount(
  data: SavingAccountInput,
  userId: number,
) {
  const { name, type, currentAmt } = data;

  if (!name || !type || !currentAmt) throw new Error('All fields are required');

  const wallet = await db.wallet.create({
    data: { userId, name, type: WalletType.SAVINGS, balance: currentAmt },
  });

  const newSavingAccount = await db.savingAccount.create({
    data: { ...data, userId, walletId: wallet.id },
  });

  return newSavingAccount;
}

export async function editSavingAccountt(
  id: number,
  data: SavingAccountInput,
  userId: number,
) {
  const { name, type, currentAmt } = data;

  if (!name || !type || !currentAmt) throw new Error('All fields are required');

  return db.savingAccount.update({
    where: { id, userId },
    data: { ...data },
  });
}

export async function removeSavingAccount(id: number, userId: number) {
  return db.savingAccount.delete({ where: { id, userId } });
}

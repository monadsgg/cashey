import db from '../utils/db';
import { InvestmentAccountType, SavingType, WalletType } from '../utils/enums';

interface SavingAccountInput {
  name: string;
  type: WalletType.SAVINGS;
  balance: number;
  targetAmt?: number;
  owner?: string;
  accountType: SavingType.PERSONAL | SavingType.INVESTMENT;
  investmentType?:
    | InvestmentAccountType.TFSA
    | InvestmentAccountType.RRSP
    | InvestmentAccountType.FHSA;
  contributionLimit?: number;
}

export async function getAllSavings(userId: number) {
  const savingAccounts = await db.wallet.findMany({
    where: { userId, type: WalletType.SAVINGS },
    include: {
      savingAccount: true,
    },
    omit: {
      userId: true,
    },
  });
  return savingAccounts;
}

export async function addSavingAccount(
  data: SavingAccountInput,
  userId: number,
) {
  const {
    name,
    balance,
    type,
    targetAmt,
    owner,
    accountType,
    investmentType,
    contributionLimit,
  } = data;

  if (!name || !balance) throw new Error('All fields are required');

  const newSavingAccount = await db.wallet.create({
    data: {
      userId,
      name,
      type,
      balance,
      savingAccount: {
        create: {
          targetAmt,
          owner,
          accountType,
          investmentType,
          contributionLimit,
        },
      },
    },
    include: {
      savingAccount: true,
    },
  });

  return newSavingAccount;
}

export async function editSavingAccountt(
  id: number,
  data: SavingAccountInput,
  userId: number,
) {
  const {
    name,
    balance,
    type,
    targetAmt,
    owner,
    accountType,
    investmentType,
    contributionLimit,
  } = data;

  if (!name || !balance) throw new Error('All fields are required');

  return db.wallet.update({
    where: { id, userId },
    data: {
      name,
      balance,
      type,
      savingAccount: {
        update: {
          targetAmt,
          owner,
          accountType,
          investmentType,
          contributionLimit,
        },
      },
    },
    include: {
      savingAccount: true,
    },
  });
}

export async function removeSavingAccount(id: number, userId: number) {
  return db.wallet.delete({ where: { id, userId } });
}

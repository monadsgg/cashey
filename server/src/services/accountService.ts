import db from '../utils/db';
import { InvestmentAccountType, WalletType } from '../utils/enums';

interface accountInput {
  name: string;
  accountType: WalletType.SAVINGS | WalletType.INVESTMENT;
  balance: number;
  targetAmt?: number;
  owner?: string;
  investmentType?:
    | InvestmentAccountType.TFSA
    | InvestmentAccountType.RRSP
    | InvestmentAccountType.FHSA;
  contributionLimit?: number;
}

export async function getAllAccounts(userId: number) {
  const accounts = await db.wallet.findMany({
    where: {
      userId,
      OR: [{ type: WalletType.SAVINGS }, { type: WalletType.INVESTMENT }],
    },
    orderBy: { name: 'asc' },
    include: {
      account: true,
      transactions: { select: { id: true } },
    },
    omit: {
      userId: true,
    },
  });
  return accounts;
}

export async function addAccount(data: accountInput, userId: number) {
  const {
    name,
    balance,
    targetAmt,
    owner,
    accountType,
    investmentType,
    contributionLimit,
  } = data;

  if (!name || !balance) throw new Error('All fields are required');

  const newAccount = await db.wallet.create({
    data: {
      userId,
      name,
      type: accountType,
      balance,
      account: {
        create: {
          targetAmt,
          owner,
          investmentType,
          contributionLimit,
        },
      },
    },
    include: {
      account: true,
    },
  });

  return newAccount;
}

export async function editAccount(
  id: number,
  data: accountInput,
  userId: number,
) {
  const {
    name,
    balance,
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
      type: accountType,
      account: {
        update: {
          targetAmt,
          owner,
          investmentType,
          contributionLimit,
        },
      },
    },
    include: {
      account: true,
    },
  });
}

export async function removeAccount(id: number, userId: number) {
  return db.wallet.delete({ where: { id, userId } });
}

export async function getAllAccountsTransactions(
  userId: number,
  start: string,
  end: string,
) {
  return db.transaction.findMany({
    where: {
      userId,
      wallet: {
        OR: [{ type: WalletType.SAVINGS }, { type: WalletType.INVESTMENT }],
      },
      date: { gte: new Date(start), lte: new Date(end) },
    },
    include: {
      wallet: { omit: { userId: true, type: true, balance: true } },
      category: { omit: { userId: true } },
    },
    omit: {
      userId: true,
      categoryId: true,
      payeeId: true,
      walletId: true,
    },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
}

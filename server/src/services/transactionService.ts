import { Prisma } from '@prisma/client';
import db from '../utils/db';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  OUT_TRANSFER_CATEGORY_ID,
  IN_TRANSFER_CATEGORY_ID,
} from '../constants';
import { CategoryType } from '../utils/enums';

interface TransactionFilters {
  userId: number;
  query?: string;
  start?: string;
  end?: string;
  page?: number;
  pageSize?: number;
}

export async function getAllTransactions({
  userId,
  query,
  start,
  end,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
}: TransactionFilters) {
  const where: Prisma.TransactionWhereInput = { userId };

  if (query) {
    where.description = {
      contains: query,
      mode: 'insensitive',
    };
  }

  if (start && end) {
    where.date = { gte: new Date(start), lte: new Date(end) };
  }

  const skip = (page - 1) * pageSize;

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: pageSize,
    }),
    db.transaction.count({ where }),
  ]);

  return {
    data: transactions,
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

async function findOrCreateTagByName(name: string, userId: number) {
  const tagExists = await db.tag.findUnique({
    where: { name_userId: { name, userId } },
  });
  if (tagExists) return tagExists.id;

  const newTag = await db.tag.create({ data: { name, userId } });
  return newTag.id;
}

async function findOrCreatePayeeByName(name: string, userId: number) {
  const payeeExists = await db.payee.findUnique({
    where: { name_userId: { name, userId } },
  });
  if (payeeExists) return payeeExists.id;

  const newPayee = await db.payee.create({
    data: { name, userId },
  });
  return newPayee.id;
}

export async function addTransaction(
  description: string,
  categoryId: number,
  amount: number,
  date: string,
  userId: number,
  walletId: number,
  tagName: string,
  payeeName: string,
) {
  if (!description || !categoryId || !amount || !date)
    throw new Error('All fields are required');

  const wallet = await db.wallet.findUnique({
    where: { id: walletId, userId },
  });
  if (!wallet) throw new Error('Wallet does not exist');

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error('Category does not exist');

  const result = await db.$transaction(async (tx) => {
    // 0) Find/Create tag or payee
    const tagId = tagName ? await findOrCreateTagByName(tagName, userId) : null;
    const payeeId = payeeName
      ? await findOrCreatePayeeByName(payeeName, userId)
      : null;

    // 1) create a new transaction
    const newTransaction = await tx.transaction.create({
      data: {
        description,
        categoryId,
        amount,
        date: new Date(date),
        userId,
        walletId,
        tagId: tagId ? tagId : undefined,
        payeeId: payeeId ? payeeId : undefined,
      },
    });

    // 2) calculate new balance
    const newBalance =
      category.type === CategoryType.INCOME
        ? Number(wallet.balance) + amount
        : Number(wallet.balance) - amount;

    // 3) update main wallet balance
    await tx.wallet.update({
      where: { id: walletId },
      data: { balance: newBalance },
    });

    return newTransaction;
  });

  return result;
}

export async function editTransaction(
  id: number,
  description: string,
  categoryId: number,
  amount: number,
  date: string,
  userId: number,
) {
  if (!description || !categoryId || !amount || !date)
    throw new Error('All fields are required');

  return db.transaction.update({
    where: { id, userId },
    data: { description, categoryId, amount, date: new Date(date) },
  });
}

export async function removeTransaction(id: number, userId: number) {
  return db.transaction.delete({ where: { id, userId } });
}

export async function transferFunds(
  userId: number,
  fromWalletId: number,
  toWalletId: number,
  amount: number,
  description: string,
) {
  if (fromWalletId === toWalletId) {
    throw new Error('Cannot transfer to the same wallet');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  const [fromWallet, toWallet] = await Promise.all([
    db.wallet.findUnique({ where: { id: fromWalletId } }),
    db.wallet.findUnique({ where: { id: toWalletId } }),
  ]);

  if (!fromWallet || !toWallet) {
    throw new Error('Wallet is not valid');
  }

  if (fromWallet.userId !== userId || toWallet.userId !== userId)
    throw new Error('Unauthorized access to wallet');

  if (Number(fromWallet.balance) < amount)
    throw new Error('Insufficient funds');

  const result = await db.$transaction(async (tx) => {
    // 1) create outgoing transfer transaction
    const outTranserTransaction = await tx.transaction.create({
      data: {
        description: description || `Transfer to ${toWallet.name}`,
        categoryId: OUT_TRANSFER_CATEGORY_ID,
        amount,
        date: new Date(),
        walletId: fromWalletId,
        userId,
      },
    });

    // 2) create incoming transfer transaction
    await tx.transaction.create({
      data: {
        description: description || `Transfer from ${fromWallet.name}`,
        categoryId: IN_TRANSFER_CATEGORY_ID,
        amount,
        date: new Date(),
        walletId: toWalletId,
        userId,
      },
    });

    // 3) update fromWallet balance
    await tx.wallet.update({
      where: { id: fromWalletId },
      data: { balance: Number(fromWallet.balance) - amount },
    });

    // 4) update toWallet balance
    await tx.wallet.update({
      where: { id: toWalletId },
      data: { balance: Number(toWallet.balance) + amount },
    });

    return outTranserTransaction;
  });

  return result;
}

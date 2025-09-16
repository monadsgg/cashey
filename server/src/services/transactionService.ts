import { Prisma } from '@prisma/client';
import db from '../utils/db';
import {
  OUT_TRANSFER_CATEGORY_ID,
  IN_TRANSFER_CATEGORY_ID,
  CATEGORY_DEFAULT_COLOR,
  TAG_DEFAULT_COLOR,
} from '../constants';
import { CategoryType, WalletType } from '../utils/enums';

interface TransactionFilters {
  userId: number;
  query?: string;
  start?: string;
  end?: string;
  page?: number;
  pageSize?: number;
}

interface ImportedTransaction {
  date: string;
  description: string;
  amount: number;
  category: string;
  payee: string;
  tags: string[];
}

export async function getAllTransactions({
  userId,
  query,
  start,
  end,
  page,
  pageSize,
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

  if (page && pageSize) {
    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      db.transaction.findMany({
        where: { ...where, wallet: { type: WalletType.MAIN } },
        orderBy: [{ date: 'desc' }, { id: 'desc' }],
        skip,
        take: pageSize,
        include: {
          category: {
            omit: { userId: true },
          },
          tags: { omit: { userId: true } },
          payee: { omit: { userId: true } },
        },
        omit: {
          categoryId: true,
          userId: true,
          walletId: true,
          payeeId: true,
        },
      }),
      db.transaction.count({
        where: { ...where, wallet: { type: WalletType.MAIN } },
      }),
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

  return db.transaction.findMany({
    where: { ...where, wallet: { type: WalletType.MAIN } },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
    select: {
      id: true,
      date: true,
      amount: true,
      category: { omit: { userId: true, color: true } },
      isRefund: true,
    },
  });
}

export async function addTransaction(
  description: string,
  categoryId: number,
  amount: number,
  date: string,
  userId: number,
  walletId: number,
  tagIds: number[],
  payeeId: number,
  isRefund: boolean = false,
) {
  if (!description || !categoryId || !amount || !date)
    throw new Error('All fields are required');

  const wallet = await db.wallet.findUnique({
    where: { id: walletId, userId },
  });
  if (!wallet) throw new Error('Wallet does not exist');

  const category = await db.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new Error('Category does not exist');

  return db.transaction.create({
    data: {
      description,
      categoryId,
      amount,
      date: new Date(date),
      userId,
      walletId,
      tags: {
        connect: tagIds.map((id) => ({ id })),
      },
      payeeId: payeeId || undefined,
      isRefund,
    },
    include: {
      category: { omit: { userId: true } },
      tags: { omit: { userId: true } },
      payee: { omit: { userId: true } },
    },
    omit: {
      categoryId: true,
      userId: true,
      payeeId: true,
    },
  });
}

export async function editTransaction(
  id: number,
  description: string,
  categoryId: number,
  amount: number,
  date: string,
  userId: number,
  tagIds: number[],
  payeeId: number | null,
  isRefund: boolean,
) {
  if (!description || !categoryId || !amount || !date)
    throw new Error('All fields are required');

  return db.transaction.update({
    where: { id },
    data: {
      description,
      categoryId,
      amount,
      date: new Date(date),
      tags: {
        set: tagIds.map((id) => ({ id })),
      },
      payeeId,
      isRefund,
    },
    include: {
      category: {
        omit: { userId: true },
      },
      tags: { omit: { userId: true } },
      payee: { omit: { userId: true } },
    },
    omit: {
      categoryId: true,
      userId: true,
      walletId: true,
      payeeId: true,
    },
  });
}

export async function removeTransaction(id: number, userId: number) {
  return db.transaction.delete({ where: { id, userId } });
}

export async function transferFunds(
  userId: number,
  fromWalletId: number,
  toWalletId: number,
  date: string,
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
        date: new Date(date),
        walletId: fromWalletId,
        userId,
      },
      omit: {
        userId: true,
        payeeId: true,
      },
    });

    // 2) create incoming transfer transaction
    await tx.transaction.create({
      data: {
        description: description || `Transfer from ${fromWallet.name}`,
        categoryId: IN_TRANSFER_CATEGORY_ID,
        amount,
        date: new Date(date),
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

async function getOrCreatePayee(userId: number, name: string) {
  const existingPayee = await db.payee.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      userId,
    },
  });

  if (existingPayee) return existingPayee;
  else
    return await db.payee.create({
      data: { name, userId },
    });
}

async function getOrCreateTag(userId: number, name: string) {
  const existingTag = await db.tag.findFirst({
    where: {
      name: { equals: name, mode: 'insensitive' },
      userId,
    },
  });

  if (existingTag) return existingTag;
  else {
    return await db.tag.create({
      data: { name, userId, color: TAG_DEFAULT_COLOR },
    });
  }
}

export async function addTransactions(
  transactions: ImportedTransaction[],
  userId: number,
) {
  const createdTransactions = [];

  // get main wallet id
  const wallet = await db.wallet.findFirst({
    where: { userId, type: { equals: WalletType.MAIN } },
  });
  if (!wallet) throw new Error('Wallet does not exist');

  // pre-load categories
  let existingCategories = await db.category.findMany({
    where: { OR: [{ userId }, { userId: { equals: null } }] },
  });

  const categoryMap = new Map(
    existingCategories.map((c) => [c.name.trim().toLowerCase(), c]),
  );

  for (const t of transactions) {
    const isRefund = t.description.toLowerCase().includes('refund');

    // 1) Check if category exist else create a new one
    const categoryKey = t.category.trim().toLowerCase();
    let category = categoryMap.get(categoryKey);
    if (!category) {
      category = await db.category.create({
        data: {
          userId,
          name: t.category,
          type: CategoryType.EXPENSE,
          color: CATEGORY_DEFAULT_COLOR,
        },
      });

      categoryMap.set(categoryKey, category);
    }

    // 2) Check if payee exist else create a new one
    let payeeId: number | null = null;
    if (t.payee) {
      const payee = await getOrCreatePayee(userId, t.payee);
      payeeId = payee.id;
    }

    // 3) Check if tags exist else create a new one
    let tagIds: number[] = [];
    if (t.tags && t.tags.length > 0) {
      for (const tagName of t.tags) {
        const tag = await getOrCreateTag(userId, tagName);
        tagIds.push(tag.id);
      }
    }

    // 4) Creata a new transaction
    const transaction = await db.transaction.create({
      data: {
        description: t.description,
        amount: t.amount,
        date: new Date(t.date),
        userId,
        walletId: wallet?.id,
        categoryId: category.id,
        payeeId,
        tags: { connect: tagIds.map((id) => ({ id })) },
        isRefund: isRefund,
      },
      select: {
        id: true,
        description: true,
        amount: true,
        date: true,
        isRefund: true,
        walletId: true,
        category: { omit: { userId: true } },
        tags: { omit: { userId: true } },
        payee: { omit: { userId: true } },
      },
    });

    createdTransactions.push(transaction);
  }

  return createdTransactions;
}

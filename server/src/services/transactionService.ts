import { Prisma } from '@prisma/client';
import db from '../utils/db';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

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

export async function addTransaction(
  description: string,
  categoryId: number,
  amount: number,
  date: string,
  userId: number,
  walletId: number,
) {
  if (!description || !categoryId || !amount || !date)
    throw new Error('All fields are required');

  const newTransaction = await db.transaction.create({
    data: {
      description,
      categoryId,
      amount,
      date: new Date(date),
      userId,
      walletId,
    },
  });

  return newTransaction;
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

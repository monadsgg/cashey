import db from '../utils/db';
import { CategoryType, SavingType, WalletType } from '../utils/enums';
import {
  IN_TRANSFER_CATEGORY_ID,
  OUT_TRANSFER_CATEGORY_ID,
  SALARY_CATEGORY_ID,
} from '../constants';

export async function getCategorySpending(
  userId: number,
  month: number,
  year: number,
) {
  // handle monthly and yearly period
  let startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
  let endDate = month ? new Date(year, month, 0) : new Date(year, 11, 31);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate, lte: endDate },
      wallet: { type: WalletType.MAIN },
      category: {
        type: { not: { equals: CategoryType.INCOME } },
        id: { notIn: [OUT_TRANSFER_CATEGORY_ID, IN_TRANSFER_CATEGORY_ID] },
      },
    },
    include: { category: { omit: { userId: true, type: true } } },
  });

  const categorySpentMap = new Map<
    number,
    { category: { id: number; name: string; color: string }; total: number }
  >();

  for (const tx of transactions) {
    if (!categorySpentMap.has(tx.categoryId)) {
      categorySpentMap.set(tx.categoryId, { category: tx.category, total: 0 });
    }
    categorySpentMap.get(tx.categoryId)!.total += Number(tx.amount);
  }

  const result = Array.from(categorySpentMap.values());
  return result;
}

export async function getStatsOverview(
  userId: number,
  month: number,
  year: number,
) {
  const stats = {
    income: 0,
    expense: 0,
    savings: 0,
    cashBalance: 0,
    networth: 0,
  };

  // handle monthly and yearly period
  let startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);
  let endDate = month ? new Date(year, month, 0) : new Date(year, 11, 31);

  const [groupedTransactions, cashBalance, networthBalance] = await Promise.all(
    [
      db.transaction.groupBy({
        by: ['categoryId'],
        where: {
          userId,
          date: { gte: startDate, lte: endDate },
          wallet: { type: WalletType.MAIN },
          category: { id: { notIn: [IN_TRANSFER_CATEGORY_ID] } },
        },
        _sum: { amount: true },
      }),
      db.wallet.aggregate({
        _sum: { balance: true },
        where: { userId, NOT: { type: { equals: SavingType.INVESTMENT } } },
      }),
      db.wallet.aggregate({
        _sum: { balance: true },
        where: { userId },
      }),
    ],
  );

  if (!!groupedTransactions.length) {
    for (const tx of groupedTransactions) {
      const amount = Number(tx._sum.amount);
      if (tx.categoryId === SALARY_CATEGORY_ID) {
        stats.income += amount;
      } else if (tx.categoryId === OUT_TRANSFER_CATEGORY_ID) {
        stats.savings += amount;
      } else {
        stats.expense += amount;
      }
    }
  }

  const finalStats = {
    ...stats,
    cashBalance: cashBalance._sum.balance ?? 0,
    networth: networthBalance._sum.balance ?? 0,
  };

  return finalStats;
}

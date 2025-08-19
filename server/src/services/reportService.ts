import db from '../utils/db';
import { CategoryType, WalletType } from '../utils/enums';
import {
  IN_TRANSFER_CATEGORY_ID,
  OUT_TRANSFER_CATEGORY_ID,
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
      date: {
        gte: startDate,
        lte: endDate,
      },
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

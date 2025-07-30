import db from '../utils/db';

export async function getAllBudgets(
  userId: number,
  month: number,
  year: number,
) {
  const budgets = await db.budget.findMany({
    where: { userId, month, year },
    include: { category: { omit: { userId: true, color: true, type: true } } },
    omit: { categoryId: true, userId: true },
  });

  let startDate;
  let endDate;
  if (month && year) {
    startDate = new Date(year, month - 1, 1);
    endDate = new Date(year, month, 0);
  }
  if (year) {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31);
  }

  const categoryIds = [...new Set(budgets.map((b) => b.category.id))];
  const transactions = await db.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      categoryId: { in: categoryIds },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  // console.log(transactions);

  const categorySpentMap = Object.fromEntries(
    transactions.map((t) => [t.categoryId, t._sum.amount || 0]),
  );

  // console.log(categorySpentMap);

  const finalBudgets = budgets.map((budget) => {
    const amountSpent = Number(categorySpentMap[budget.category.id]) || 0;
    const amountLeft = budget.amountLimit - amountSpent;

    return { ...budget, amountSpent, amountLeft };
  });

  return finalBudgets;
}

export async function addBudget(
  categoryId: number,
  amountLimit: number,
  month: number,
  year: number,
  userId: number,
) {
  if (!categoryId || !amountLimit || !month || !year)
    throw new Error('All fields are required');

  const budgetEntryExists = await db.budget.findFirst({
    where: { categoryId, userId, month, year },
  });

  if (budgetEntryExists) throw new Error('Budget entry already exists');

  const budgetEntry = db.budget.create({
    data: { categoryId, amountLimit, month, year, userId },
    omit: { userId: true },
  });

  return budgetEntry;
}

export async function editBudget(
  id: number,
  categoryId: number,
  amountLimit: number,
  month: number,
  year: number,
  userId: number,
) {
  if (!categoryId || !amountLimit) throw new Error('All fields are required');

  return db.budget.update({
    where: { id, userId, categoryId, month, year },
    data: { amountLimit },
    omit: { userId: true },
  });
}

export async function removeBudget(id: number, userId: number) {
  return db.budget.delete({ where: { id, userId } });
}

import db from '../utils/db';

export async function getAllBudgets(
  userId: number,
  month: number,
  year: number,
) {
  const budgets = await db.budget.findMany({
    where: { userId, month, year },
    include: { category: { omit: { userId: true } } },
    omit: { categoryId: true, userId: true },
  });
  return budgets;
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
  });
}

export async function removeBudget(id: number, userId: number) {
  return db.budget.delete({ where: { id, userId } });
}

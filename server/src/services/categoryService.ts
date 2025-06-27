import db from '../utils/db';
import { CategoryType } from '../utils/enums';

export async function getAllCategories(userId: number) {
  const categories = await db.category.findMany({
    where: { OR: [{ userId }, { userId: { equals: null } }] },
    omit: { userId: true },
  });

  return categories;
}

export async function addCategory(
  name: string,
  type: CategoryType.INCOME | CategoryType.EXPENSE,
  userId: number,
) {
  if (!name || !type) throw new Error('All fields are required');

  const categoryExists = await db.category.findFirst({
    where: { name, userId },
  });
  if (categoryExists) throw new Error('Category name already exists');

  const newCategory = await db.category.create({
    data: {
      name,
      type,
      userId,
    },
    omit: { userId: true },
  });

  return newCategory;
}

export async function editCategory(
  id: number,
  name: string,
  type: CategoryType.INCOME | CategoryType.EXPENSE,
  userId: number,
) {
  const category = await db.category.findUnique({ where: { id } });

  if (!category || category.userId !== userId)
    throw new Error('Category not found or not allowed to edit');

  return db.category.update({
    where: { id },
    data: { name, type },
    omit: { userId: true },
  });
}

export async function removeCategory(id: number, userId: number) {
  const category = await db.category.findUnique({ where: { id } });

  if (!category || category.userId !== userId)
    throw new Error('Category not found or not allowed to delete');

  return db.category.delete({ where: { id } });
}

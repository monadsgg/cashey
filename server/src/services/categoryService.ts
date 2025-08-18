import db from '../utils/db';
import { CategoryType } from '../utils/enums';
import {
  OUT_TRANSFER_CATEGORY_ID,
  IN_TRANSFER_CATEGORY_ID,
} from '../constants';

export async function getAllCategories(userId: number) {
  const hiddenIds = await db.hiddenCategory.findMany({ where: { userId } });

  const categories = await db.category.findMany({
    where: {
      OR: [{ userId }, { userId: { equals: null } }],
      NOT: [{ id: OUT_TRANSFER_CATEGORY_ID }, { id: IN_TRANSFER_CATEGORY_ID }],
      id: { notIn: hiddenIds.map((h) => h.categoryId) },
    },
    orderBy: { name: 'asc' },
    omit: { userId: true },
  });

  return categories;
}

export async function addCategory(
  name: string,
  type: CategoryType.INCOME | CategoryType.EXPENSE,
  userId: number,
  color: string,
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
      color,
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
  color: string,
) {
  const category = await db.category.findUnique({ where: { id } });

  if (!category) throw new Error('Category not found');

  if (category.userId !== userId) {
    // add pre-defined categories to hidden category
    await db.hiddenCategory.create({
      data: { userId, categoryId: category.id },
    });

    // create a copy of the predefined category within the user's category
    const clonedCategory = await db.category.create({
      data: {
        name,
        type,
        userId,
        color,
      },
      omit: { userId: true },
    });

    return clonedCategory;
  }

  return db.category.update({
    where: { id },
    data: { name, type, color },
    omit: { userId: true },
  });
}

export async function removeCategory(id: number, userId: number) {
  const category = await db.category.findUnique({ where: { id } });

  if (!category) throw new Error('Category not found');

  if (category.userId !== userId) {
    // add pre-defined categories to hidden category
    await db.hiddenCategory.create({
      data: { userId, categoryId: category.id },
    });

    return;
  }

  return db.category.delete({ where: { id } });
}

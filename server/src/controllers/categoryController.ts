import { Request, Response } from 'express';
import {
  addCategory,
  editCategory,
  getAllCategories,
  removeCategory,
} from '../services/categoryService';

export async function getCategories(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;

  try {
    const categories = await getAllCategories(userId);
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { name, type, color } = req.body;

  try {
    const category = await addCategory(name, type, userId, color);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const { name, type, color } = req.body;

  try {
    const category = await editCategory(Number(id), name, type, userId, color);
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeCategory(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

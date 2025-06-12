import { Request, Response } from 'express';
import {
  addBudget,
  editBudget,
  getAllBudgets,
  removeBudget,
} from '../services/budgetService';

export async function getBudgets(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { month, year } = req.body;

  try {
    const budgets = await getAllBudgets(userId, month, year);
    res.status(200).json(budgets);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch budgets' });
  }
}

export async function createBudget(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { categoryId, amountLimit, month, year } = req.body;

  try {
    const budget = await addBudget(
      categoryId,
      amountLimit,
      month,
      year,
      userId,
    );
    res.status(201).json(budget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateBudget(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const { categoryId, amountLimit, month, year } = req.body;

  try {
    const budget = await editBudget(
      Number(id),
      categoryId,
      amountLimit,
      month,
      year,
      userId,
    );
    res.status(200).json(budget);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteBudget(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeBudget(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

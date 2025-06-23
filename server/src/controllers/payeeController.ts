import { Request, Response } from 'express';
import {
  addPayee,
  editPayee,
  getAllPayees,
  removePayee,
} from '../services/payeeService';

export async function getPayees(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;

  try {
    const payees = await getAllPayees(userId);
    res.status(200).json(payees);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch payees' });
  }
}

export async function createPayee(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { name } = req.body;

  try {
    const payee = await addPayee(name, userId);
    res.status(201).json(payee);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updatePayee(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const { name } = req.body;

  try {
    const payee = await editPayee(Number(id), name, userId);
    res.status(200).json(payee);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deletePayee(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removePayee(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

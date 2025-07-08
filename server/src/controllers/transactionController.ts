import { Request, Response } from 'express';
import {
  addTransaction,
  editTransaction,
  getAllTransactions,
  removeTransaction,
  transferFunds,
} from '../services/transactionService';

export async function getTransactions(
  req: Request,
  res: Response,
): Promise<void> {
  const { query, page, pageSize, start, end } = req.query;

  try {
    const transactions = await getAllTransactions({
      userId: res.locals.user,
      query: query as string,
      page: Number(page) || undefined,
      pageSize: Number(pageSize) || undefined,
      start: start as string,
      end: end as string,
    });
    res.status(200).json(transactions);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
}

export async function createTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  const {
    description,
    categoryId,
    amount,
    date,
    walletId,
    tagName,
    payeeName,
  } = req.body;
  const userId = res.locals.user;

  try {
    const transaction = await addTransaction(
      description,
      categoryId,
      amount,
      date,
      userId,
      walletId,
      tagName,
      payeeName,
    );

    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const { description, categoryId, amount, date, tagId, payeeId } = req.body;

  try {
    const transaction = await editTransaction(
      Number(id),
      description,
      categoryId,
      amount,
      date,
      userId,
      tagId,
      payeeId,
    );
    res.status(200).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeTransaction(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function transferFundsTransaction(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { fromWalletId, toWalletId, date, amount, description } = req.body;

  try {
    const transaction = await transferFunds(
      userId,
      fromWalletId,
      toWalletId,
      date,
      amount,
      description,
    );
    res.status(201).json(transaction);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

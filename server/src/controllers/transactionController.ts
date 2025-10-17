import { Request, Response } from 'express';
import {
  addTransaction,
  addTransactions,
  editTransaction,
  getAllTransactions,
  removeTransaction,
  transferFunds,
} from '../services/transactionService';
import { z } from 'zod';
import { FilterRuleType } from '../utils/enums';

const filterConditionSchema = z.object({
  rule: z.enum([
    FilterRuleType.CONTAINS,
    FilterRuleType.EXACT,
    FilterRuleType.IS,
    FilterRuleType.IS_NOT,
    FilterRuleType.GREATER_THAN,
    FilterRuleType.LESS_THAN,
  ]),
  value: z.union([z.string(), z.number()]),
});

const filtersSchema = z
  .object({
    search: filterConditionSchema.optional(),
    payee: filterConditionSchema.optional(),
    category: filterConditionSchema.optional(),
    tag: filterConditionSchema.optional(),
    income: filterConditionSchema.optional(),
    expense: filterConditionSchema.optional(),
  })
  .optional();

export async function getTransactions(
  req: Request,
  res: Response,
): Promise<void> {
  const {
    searchVal,
    page,
    pageSize,
    start,
    end,
    filters: filtersParam,
  } = req.query;

  try {
    let filters = {};

    if (filtersParam) {
      const parsed = JSON.parse(filtersParam as string);
      filters = filtersSchema.parse(parsed) || {};
    }

    const transactions = await getAllTransactions({
      userId: res.locals.user,
      searchVal: searchVal as string,
      page: Number(page) || undefined,
      pageSize: Number(pageSize) || undefined,
      start: start as string,
      end: end as string,
      ...filters,
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
  const { description, categoryId, amount, date, walletId, tagIds, payeeId } =
    req.body;
  const userId = res.locals.user;

  try {
    const transaction = await addTransaction(
      description,
      categoryId,
      amount,
      date,
      userId,
      walletId,
      tagIds,
      payeeId,
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
  const { description, categoryId, amount, date, tagIds, payeeId, isRefund } =
    req.body;

  try {
    const transaction = await editTransaction(
      Number(id),
      description,
      categoryId,
      amount,
      date,
      userId,
      tagIds,
      payeeId,
      isRefund,
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

export async function importTransactions(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const transactions = req.body;

  try {
    const createdTransactions = await addTransactions(transactions, userId);
    res.status(201).json({
      message: `(${createdTransactions.length}) Transactions  imported successfully`,
      transactions: createdTransactions,
      count: createdTransactions.length,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

import { Request, Response } from 'express';
import {
  addAccount,
  editAccount,
  getAllAccounts,
  getAllAccountsTransactions,
  removeAccount,
} from '../services/accountService';

export async function getAccounts(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;

  try {
    const accounts = await getAllAccounts(userId);
    res.status(200).json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch accounts' });
  }
}

export async function getAccountsTransactions(
  req: Request,
  res: Response,
): Promise<void> {
  const { start, end } = req.query;
  const userId = res.locals.user;

  try {
    const accounts = await getAllAccountsTransactions(
      userId,
      start as string,
      end as string,
    );
    res.status(200).json(accounts);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch accounts transactions' });
  }
}

export async function createAccount(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const {
    name,
    balance,
    targetAmt,
    accountType,
    owner,
    investmentType,
    contributionLimit,
  } = req.body;

  try {
    const account = await addAccount(
      {
        name,
        balance,
        targetAmt,
        owner,
        accountType,
        investmentType,
        contributionLimit,
      },
      userId,
    );
    res.status(201).json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateAccount(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const {
    name,
    balance,
    targetAmt,
    accountType,
    owner,
    investmentType,
    contributionLimit,
  } = req.body;

  try {
    const account = await editAccount(
      Number(id),
      {
        name,
        balance,
        targetAmt,
        owner,
        accountType,
        investmentType,
        contributionLimit,
      },
      userId,
    );
    res.status(200).json(account);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeAccount(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

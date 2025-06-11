import { Request, Response } from 'express';
import {
  addSavingAccount,
  editSavingAccountt,
  getAllSavings,
  removeSavingAccount,
} from '../services/savingAccountService';

export async function getSavingAccounts(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;

  try {
    const savings = await getAllSavings(userId);
    res.status(200).json(savings);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch savings' });
  }
}

export async function createSavingAccount(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const {
    name,
    type,
    currentAmt,
    targetAmt,
    accountType,
    owner,
    contributionLimit,
  } = req.body;

  try {
    const savingAccount = await addSavingAccount(
      {
        name,
        type,
        currentAmt,
        targetAmt,
        owner,
        accountType,
        contributionLimit,
      },
      userId,
    );
    res.status(201).json(savingAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateSavingAccounts(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;
  const {
    name,
    type,
    currentAmt,
    targetAmt,
    accountType,
    owner,
    contributionLimit,
  } = req.body;

  try {
    const savingAccount = await editSavingAccountt(
      Number(id),
      {
        name,
        type,
        currentAmt,
        targetAmt,
        owner,
        accountType,
        contributionLimit,
      },
      userId,
    );
    res.status(200).json(savingAccount);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteSavingAccounts(
  req: Request,
  res: Response,
): Promise<void> {
  const { id } = req.params;
  const userId = res.locals.user;

  try {
    await removeSavingAccount(Number(id), userId);
    res.status(204).json();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

import { Request, Response } from 'express';
import { fetchAllWallets, fetchWalletById } from '../services/walletService';

export async function getWallets(req: Request, res: Response): Promise<void> {
  const userId = res.locals.user;

  try {
    const wallets = await fetchAllWallets(userId);
    res.status(200).json(wallets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function getWalletById(
  req: Request,
  res: Response,
): Promise<void> {
  const userId = res.locals.user;
  const { id } = req.params;

  try {
    const wallet = await fetchWalletById(Number(id), userId);
    res.status(200).json(wallet);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

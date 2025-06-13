import db from '../utils/db';

export async function fetchAllWallets(userId: number) {
  const wallets = await db.wallet.findMany({
    where: { userId },
  });
  return wallets;
}

export async function fetchWalletById(id: number, userId: number) {
  const wallet = await db.wallet.findUnique({
    where: { id, userId },
  });

  if (!wallet) throw new Error('Wallet not found');

  return wallet;
}

import db from '../utils/db';

export async function fetchAllWallets(userId: number) {
  const wallets = await db.wallet.findMany({
    where: { userId },
    omit: {
      userId: true,
    },
  });
  return wallets;
}

export async function fetchWalletById(id: number, userId: number) {
  const wallet = await db.wallet.findUnique({
    where: { id, userId },
    omit: {
      userId: true,
    },
  });

  if (!wallet) throw new Error('Wallet not found');

  return wallet;
}

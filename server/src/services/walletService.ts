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

export async function editWallet(
  id: number,
  userId: number,
  payload: { name: string; balance: number },
) {
  // ensure wallet exists
  const wallet = await db.wallet.findUnique({ where: { id } });
  if (!wallet) throw new Error('Wallet not found');

  // ensure the user owns the wallet
  if (wallet.userId !== userId) throw new Error('Unauthorized');

  // build update object only with provided fields
  const data: Record<string, unknown> = {};
  if (payload.name !== undefined) data.name = payload.name;
  if (payload.balance !== undefined) {
    // accept number or numeric string
    const b =
      typeof payload.balance === 'string'
        ? Number(payload.balance)
        : payload.balance;
    if (Number.isNaN(b)) throw new Error('Invalid balance value');
    data.balance = b;
  }

  const updated = await db.wallet.update({
    where: { id },
    data,
    omit: { userId: true },
  });

  return updated;
}

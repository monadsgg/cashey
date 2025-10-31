import api from "./api";

export type Wallet = {
  id: number;
  name: string;
  type: string;
  balance: number;
};

export interface WalletPayload {
  name: string;
  balance: number;
}

export async function getWallets(): Promise<Wallet[]> {
  const result = await api.get<Wallet[]>("/api/wallets");
  return result.data;
}

export async function updateWallet(
  id: number,
  data: WalletPayload
): Promise<Wallet> {
  const result = await api.put<Wallet>(`/api/wallets/${id}`, data);
  return result.data;
}

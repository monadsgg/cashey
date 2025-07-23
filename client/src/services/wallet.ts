import api from "./api";

export type Wallet = {
  id: number;
  name: string;
  type: string;
  balance: number;
};

export async function getWallets(): Promise<Wallet[]> {
  const result = await api.get<Wallet[]>("/api/wallets");
  return result.data;
}

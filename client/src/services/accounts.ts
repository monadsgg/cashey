import api from "./api";

export interface AccountItem {
  id: number;
  name: string;
  balance: number;
  type: string;
  account: AccountDetails;
}

interface AccountDetails {
  walletId: number;
  accountType: string;
  owner: string;
  targetAmt: number;
  investmentType?: string;
  contributionLimit?: number;
}

export interface AccountPayload {
  name: string;
  balance: number;
  owner: string;
  targetAmt: number;
  accountType: string;
  investmentType?: string | null;
  contributionLimit?: number | null;
}

export async function getAccounts(): Promise<AccountItem[]> {
  const result = await api.get<AccountItem[]>("/api/accounts");
  return result.data;
}

export async function getAccountsTransactions(start: string, end: string) {
  const result = await api.get(
    `api/accounts/transactions?start=${start}&end=${end}`
  );
  return result.data;
}

export async function addAccount(data: AccountPayload) {
  const result = await api.post("/api/accounts", data);
  return result.data;
}

export async function updateAccount(id: number, data: AccountPayload) {
  const result = await api.put(`/api/accounts/${id}`, data);
  return result.data;
}

export async function deleteAccount(id: number) {
  return await api.delete(`/api/accounts/${id}`);
}

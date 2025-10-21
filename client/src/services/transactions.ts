import api from "./api";
import type { Category } from "./categories";
import type { Tag } from "./tags";
import type { Payee } from "./payees";

export interface TransactionPayload {
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  tagIds: number[];
  payeeId?: number | null;
  walletId: number;
  isRefund: boolean;
}

interface TransferPayload {
  date: string;
  fromWalletId: number;
  toWalletId: number;
  amount: number;
  description: string;
}

interface TransferResponse {
  id: number;
  walletId: number;
  categoryId: number;
  amount: number;
  date: string;
  description: string;
}

export interface TransactionItem {
  id: number;
  category: Category;
  amount: number;
  date: string;
  description: string;
  tags?: Tag[];
  payee?: Payee;
  isRefund: boolean;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedTransactionResponse {
  data: TransactionItem[];
  pagination: Pagination;
}

export interface AllTransactionsResponse {
  id: number;
  category: Category;
  amount: number;
  date: string;
  description: string;
  isRefund: boolean;
}

interface ImportedTransactionPayload {
  date: string;
  description: string;
  amount: number;
  category: string;
  payee?: string;
  tags?: string[];
}

interface ImportedTransactionResponse {
  transactions: TransactionItem;
  message: string;
  count: number;
}

interface FilterCondition {
  rule: "contains" | "exact" | "is" | "is_not" | "greater_than" | "less_than";
  value: string | number;
}

export interface TransactionFilters {
  search?: FilterCondition;
  payee?: FilterCondition;
  category?: FilterCondition;
  tag?: FilterCondition;
  income?: FilterCondition;
  expense?: FilterCondition;
}

export interface TransactionParams {
  page: number;
  pageSize?: number;
  start?: string;
  end?: string;
  searchVal?: string;
  filters?: string;
}

export async function getTransactions(
  params: TransactionParams
): Promise<PagedTransactionResponse> {
  const result = await api.get<PagedTransactionResponse>("/api/transactions", {
    params,
  });

  return result.data;
}

export async function getAllTransactions(
  start: string,
  end: string
): Promise<AllTransactionsResponse[]> {
  const result = await api.get<AllTransactionsResponse[]>(
    `/api/transactions?start=${start}&end=${end}`
  );
  return result.data;
}

export async function addTransaction(
  data: TransactionPayload
): Promise<TransactionItem> {
  const result = await api.post<TransactionItem>("/api/transactions", data);
  return result.data;
}

export async function updateTransaction(
  id: number,
  data: TransactionPayload
): Promise<TransactionItem> {
  const result = await api.put<TransactionItem>(
    `/api/transactions/${id}`,
    data
  );
  return result.data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/api/transactions/${id}`);
}

export async function transferFunds(
  data: TransferPayload
): Promise<TransferResponse> {
  const result = await api.post<TransferResponse>(
    "/api/transactions/transfer",
    data
  );
  return result.data;
}

export async function importTransactions(
  data: ImportedTransactionPayload[]
): Promise<ImportedTransactionResponse> {
  const result = await api.post<ImportedTransactionResponse>(
    "/api/transactions/import-transactions",
    data
  );
  return result.data;
}

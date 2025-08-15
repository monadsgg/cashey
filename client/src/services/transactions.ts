import api from "./api";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";
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
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PagedTransactionResponse {
  data: TransactionItem[];
  pagination: Pagination;
}

export interface AllTransactionsResponse {
  id: number;
  category: Category;
  amount: number;
  date: string;
  description: string;
}

export async function getTransactions(
  pageSize: number = DEFAULT_PAGE_SIZE,
  page: number = DEFAULT_PAGE,
  start: string,
  end: string,
  query?: string
): Promise<PagedTransactionResponse> {
  const url = `/api/transactions?pageSize=${pageSize}&page=${page}&start=${start}&end=${end}`;
  const urlWithQuery = `/api/transactions?pageSize=${pageSize}&page=${page}&start=${start}&end=${end}&query=${query}`;
  const result = !query
    ? await api.get<PagedTransactionResponse>(url)
    : await api.get<PagedTransactionResponse>(urlWithQuery);
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

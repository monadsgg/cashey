import api from "./api";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

export async function getAllTransactions(
  pageSize: number = DEFAULT_PAGE_SIZE,
  page: number = DEFAULT_PAGE,
  start: string,
  end: string,
  query?: string
) {
  const url = `/api/transactions?pageSize=${pageSize}&page=${page}&start=${start}&end=${end}`;
  const urlWithQuery = `/api/transactions?pageSize=${pageSize}&page=${page}&start=${start}&end=${end}&query=${query}`;
  const result = !query ? await api.get(url) : await api.get(urlWithQuery);
  return result.data;
}

export async function addTransaction(data: TransactionPayload) {
  const result = await api.post("/api/transactions", data);
  return result.data;
}

export async function updateTransaction(id: number, data: TransactionPayload) {
  const result = await api.put(`/api/transactions/${id}`, data);
  return result.data;
}

export async function deleteTransaction(id: number) {
  return await api.delete(`/api/transactions/${id}`);
}

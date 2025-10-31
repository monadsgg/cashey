import api from "./api";
import type { Category } from "./categories";

export interface BudgetItem {
  id: number;
  month: number;
  year: number;
  amountLimit: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  amountSpent: number;
  amountLeft: number;
}

export interface BudgetPayload {
  categoryId: number;
  amountLimit: number;
  month: number;
  year: number;
}

export interface BudgetResponse {
  id: number;
  categoryId: number;
  month: number;
  year: number;
  amountLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface CopiedBudgetResponse {
  inserted: number;
  message: string;
}

export async function getBudgets(
  month: number,
  year: number
): Promise<BudgetItem[]> {
  const result = await api.get<BudgetItem[]>(
    `/api/budgets?month=${month}&year=${year}`
  );
  return result.data;
}

export async function addBugdet(data: BudgetPayload): Promise<BudgetResponse> {
  const result = await api.post<BudgetResponse>(`/api/budgets`, data);
  return result.data;
}

export async function updateBugdet(
  id: number,
  data: BudgetPayload
): Promise<BudgetResponse> {
  const result = await api.put<BudgetResponse>(`/api/budgets/${id}`, data);
  return result.data;
}

export async function deleteBugdet(id: number): Promise<void> {
  await api.delete(`/api/budgets/${id}`);
}

export async function copyBudget(payload: {
  fromMonth: string;
  toMonth: string;
}): Promise<CopiedBudgetResponse> {
  const result = await api.post<CopiedBudgetResponse>(
    `/api/budgets/copy`,
    payload
  );
  return result.data;
}

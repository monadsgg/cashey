import api from "./api";

export async function getBudgets(month: number, year: number) {
  const result = await api.get(`/api/budgets?month=${month}&year=${year}`);
  return result.data;
}

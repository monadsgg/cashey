import api from "./api";

type Category = { id: number; name: string; color: string };

export interface SpendingByCategoryResponse {
  category: Category;
  total: number;
}

export async function getSpendingByCategory(
  month: number,
  year: number
): Promise<SpendingByCategoryResponse[]> {
  const result = await api.get<SpendingByCategoryResponse[]>(
    `/api/reports/spending-by-category??month=${month}&year=${year}`
  );
  return result.data;
}

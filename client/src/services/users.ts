import api from "./api";
import type { Category } from "./categories";

export async function getUserCategories(id: number): Promise<Category[]> {
  const result = await api.get<Category[]>(`/api/users/${id}/categories`);
  return result.data;
}

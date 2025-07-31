import api from "./api";

export interface Category {
  id: number;
  name: string;
  type: string;
  color: string;
}
export interface CategoryPayload {
  name: string;
  type: string;
  color: string;
}

export async function getCategories(): Promise<Category[]> {
  const result = await api.get<Category[]>("/api/categories");
  return result.data;
}

export async function addCategory(data: CategoryPayload): Promise<Category> {
  const result = await api.post<Category>("/api/categories", data);
  return result.data;
}

export async function updateCategory(
  id: number,
  data: CategoryPayload
): Promise<Category> {
  const result = await api.put<Category>(`/api/categories/${id}`, data);
  return result.data;
}

export async function deleteCategory(id: number): Promise<Category> {
  const result = await api.delete<Category>(`api/categories/${id}`);
  return result.data;
}

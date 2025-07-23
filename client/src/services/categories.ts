import api from "./api";

export type Category = {
  id: number;
  name: string;
  type: string;
  color: string;
};

export async function getCategories(): Promise<Category[]> {
  const result = await api.get<Category[]>("/api/categories");
  return result.data;
}

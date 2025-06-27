import api from "./api";

export async function getCategories() {
  const result = await api.get("/api/categories");
  return result.data;
}

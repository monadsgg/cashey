import api from "./api";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../constants";

export async function getAllTransactions(
  pageSize = DEFAULT_PAGE_SIZE,
  page = DEFAULT_PAGE
) {
  const result = await api.get(
    `/api/transactions?pageSize=${pageSize}&page=${page}`
  );
  return result.data;
}

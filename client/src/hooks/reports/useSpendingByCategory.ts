import { useQuery } from "@tanstack/react-query";
import {
  getSpendingByCategory,
  type SpendingByCategoryResponse,
} from "../../services/reports";

export const useSpendingByCategory = (month: number, year: number) => {
  const { data: spendingByCategory = [], isLoading } = useQuery<
    SpendingByCategoryResponse[]
  >({
    queryKey: ["spendingCategory", month, year],
    queryFn: () => getSpendingByCategory(month, year),
  });

  return { spendingByCategory, isLoading };
};

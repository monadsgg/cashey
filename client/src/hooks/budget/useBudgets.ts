import { useQuery } from "@tanstack/react-query";
import { getBudgets, type BudgetItem } from "../../services/budget";

export const useBudgets = (month: number, year: number) => {
  const { data: budgets = [], isLoading } = useQuery<BudgetItem[]>({
    queryKey: ["budgets", month, year],
    queryFn: () => getBudgets(month, year),
  });

  return { budgets, isLoading };
};

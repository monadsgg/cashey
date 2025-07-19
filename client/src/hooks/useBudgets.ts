import { useQuery } from "@tanstack/react-query";
import { getBudgets } from "../services/budget";

export const useBudgets = (month: number, year: number) => {
  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getBudgets(month, year),
  });

  return { budgets, isLoading };
};

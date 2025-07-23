import { useQuery } from "@tanstack/react-query";
import { getSavingsTransactions } from "../services/savings";
import type { DateRange } from "../pages/transaction/Transaction";

export const useSavingsTransactions = (dateRange: DateRange) => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["savings-transactions"],
    queryFn: () =>
      getSavingsTransactions(dateRange.startDate, dateRange.endDate),
  });

  return { transactions, isLoading };
};

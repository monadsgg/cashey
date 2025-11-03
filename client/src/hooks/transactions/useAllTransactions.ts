import { useQuery } from "@tanstack/react-query";
import {
  getAllTransactions,
  type AllTransactionsResponse,
} from "../../services/transactions";
import type { DateRange } from "../../pages/transaction/Transaction";

export const useAllTransactions = (dateRange: DateRange) => {
  const { data: transactions = [], isLoading } = useQuery<
    AllTransactionsResponse[]
  >({
    queryKey: ["all-transactions", dateRange.startDate, dateRange.endDate],
    queryFn: () => getAllTransactions(dateRange.startDate, dateRange.endDate),
  });

  return { transactions, isLoading };
};

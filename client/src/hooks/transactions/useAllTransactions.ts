import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllTransactions,
  type AllTransactionsResponse,
} from "../../services/transactions";
import type { DateRange } from "../../pages/transaction/Transaction";

export const useAllTransactions = (dateRange: DateRange) => {
  const txQueryKey = useMemo(
    () => ["all-transactions", dateRange.startDate, dateRange.endDate],
    [dateRange.startDate, dateRange.endDate]
  );

  const { data: transactions = [], isLoading } = useQuery<
    AllTransactionsResponse[]
  >({
    queryKey: txQueryKey,
    queryFn: () => getAllTransactions(dateRange.startDate, dateRange.endDate),
  });

  return { transactions, isLoading };
};

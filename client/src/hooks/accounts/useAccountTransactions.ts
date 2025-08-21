import { useQuery } from "@tanstack/react-query";
import { getAccountsTransactions } from "../../services/accounts";
import type { DateRange } from "../../pages/transaction/Transaction";

export const useAccountTransactions = (dateRange: DateRange) => {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["accounts-transactions"],
    queryFn: () =>
      getAccountsTransactions(dateRange.startDate, dateRange.endDate),
  });

  return { transactions, isLoading };
};

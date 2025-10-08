import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  type PagedTransactionResponse,
  type TransactionFilters,
} from "../../services/transactions";
import type { DateRange } from "../../pages/transaction/Transaction";
import { DEFAULT_PAGE_SIZE } from "../../constants";

export const useTransactions = (
  dateRange: DateRange,
  page: number,
  searchVal: string,
  filters?: TransactionFilters
) => {
  const txQueryKey = useMemo(
    () => [
      "transaction",
      dateRange.startDate,
      dateRange.endDate,
      page,
      searchVal,
      filters,
    ],
    [dateRange.startDate, dateRange.endDate, page, searchVal]
  );

  const { data: transactions = [], isLoading } =
    useQuery<PagedTransactionResponse | null>({
      queryKey: txQueryKey,
      queryFn: async () => {
        const params: any = { page, searchVal };

        console.log("params", page, searchVal);
        params.pageSize = DEFAULT_PAGE_SIZE;

        if (filters && Object.keys(filters).length > 0) {
          params.filters = JSON.stringify(filters);
        }

        if (dateRange.startDate) params.start = dateRange.startDate;
        if (dateRange.endDate) params.end = dateRange.endDate;

        return await getTransactions(params);
      },
    });

  return { transactions, isLoading };
};

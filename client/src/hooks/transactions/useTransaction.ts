import { useQuery } from "@tanstack/react-query";
import {
  getTransactions,
  type PagedTransactionResponse,
  type TransactionFilters,
  type TransactionParams,
} from "../../services/transactions";
import type { DateRange } from "../../pages/transaction/Transaction";
import { DEFAULT_PAGE_SIZE } from "../../constants";
import type { TimeframeOption } from "../../utils/timeFrame";

export const useTransactions = (
  dateRange: DateRange,
  page: number,
  searchVal: string,
  filters: TransactionFilters | null,
  filterTimeFrame: TimeframeOption | null
) => {
  const { data: transactions = null, isLoading } =
    useQuery<PagedTransactionResponse>({
      queryKey: [
        "transaction",
        dateRange.startDate,
        dateRange.endDate,
        page,
        searchVal,
        filters,
        filterTimeFrame,
      ],
      queryFn: async () => {
        const params: TransactionParams = { page };
        params.pageSize = DEFAULT_PAGE_SIZE;

        if (!!searchVal) params.searchVal = searchVal;
        if (dateRange.startDate) params.start = dateRange.startDate;
        if (dateRange.endDate) params.end = dateRange.endDate;

        if (filters && Object.keys(filters).length > 0) {
          params.filters = JSON.stringify(filters);
        }

        if (filterTimeFrame) {
          params.start = filterTimeFrame.from;
          params.end = filterTimeFrame.to;
        }

        return await getTransactions(params);
      },
    });

  return { transactions, isLoading };
};

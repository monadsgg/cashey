import { useQuery } from "@tanstack/react-query";
import {
  getAccountsTransactions,
  type AccountTransaction,
} from "../../services/accounts";
import type { DateRange } from "../../pages/transaction/Transaction";
import { transferCategory, AccountTransactionType } from "../../constants";

type GroupedTransaction = {
  [AccountTransactionType.ALL]: AccountTransaction[];
  [AccountTransactionType.DEPOSIT]: AccountTransaction[];
  [AccountTransactionType.WITHDRAWAL]: AccountTransaction[];
};

const getGroupedTransactionList = (data: AccountTransaction[]) => {
  const grouped: GroupedTransaction = {
    [AccountTransactionType.ALL]: [],
    [AccountTransactionType.DEPOSIT]: [],
    [AccountTransactionType.WITHDRAWAL]: [],
  };

  if (!data.length) return grouped;

  grouped[AccountTransactionType.ALL] = data;
  grouped[AccountTransactionType.DEPOSIT] = data.filter(
    (t) => t.category.id === transferCategory.INCOMING_TRANSFER
  );
  grouped[AccountTransactionType.WITHDRAWAL] = data.filter(
    (t) => t.category.id === transferCategory.OUTGOING_TRANSFER
  );

  return grouped;
};

export const useAccountTransactions = (dateRange: DateRange) => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["accounts-transactions"],
    queryFn: () =>
      getAccountsTransactions(dateRange.startDate, dateRange.endDate),
    select: (data: AccountTransaction[]) => {
      return getGroupedTransactionList(data);
    },
  });

  return { transactions, isLoading };
};

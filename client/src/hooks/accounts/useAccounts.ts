import { useQuery } from "@tanstack/react-query";
import { getAccounts, type AccountItem } from "../../services/accounts";
import { WalletType } from "../../constants";

export const useAccounts = () => {
  const { data: accounts = [], isLoading } = useQuery<AccountItem[]>({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const personalAccounts = accounts.filter(
    (acc: AccountItem) => acc.type === WalletType.SAVINGS
  );

  const investmentAccounts = accounts.filter(
    (acc: AccountItem) => acc.type === WalletType.INVESTMENT
  );

  return {
    accounts,
    personalAccounts,
    investmentAccounts,
    isLoading,
  };
};

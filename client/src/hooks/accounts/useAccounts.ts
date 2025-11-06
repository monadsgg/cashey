import { useQuery } from "@tanstack/react-query";
import { getAccounts, type AccountItem } from "../../services/accounts";
import { WalletType } from "../../constants";

type AccountData = {
  personalAccounts: AccountItem[];
  investmentAccounts: AccountItem[];
};

export const useAccounts = () => {
  const {
    data = { personalAccounts: [], investmentAccounts: [] } as AccountData,
    isLoading,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
    select: (accounts: AccountItem[]) => {
      const personalAccounts = accounts.filter(
        (acc: AccountItem) => acc.type === WalletType.SAVINGS
      );

      const investmentAccounts = accounts.filter(
        (acc: AccountItem) => acc.type === WalletType.INVESTMENT
      );

      return { personalAccounts, investmentAccounts };
    },
  });

  return {
    personalAccounts: data.personalAccounts,
    investmentAccounts: data.investmentAccounts,
    isLoading,
  };
};

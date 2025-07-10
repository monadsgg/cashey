import { useQuery } from "@tanstack/react-query";
import { getSavings } from "../services/savings";
import { INVESTMENT_SAVING_TYPE, PERSONAL_SAVING_TYPE } from "../constants";

export const useSavings = () => {
  const { data: savings = [], isLoading } = useQuery<SavingAccount[]>({
    queryKey: ["savings"],
    queryFn: getSavings,
  });

  const personalAccounts = savings.filter(
    (acc: SavingAccount) =>
      acc.savingAccount.accountType === PERSONAL_SAVING_TYPE
  );

  const investmentAccounts = savings.filter(
    (acc: SavingAccount) =>
      acc.savingAccount.accountType === INVESTMENT_SAVING_TYPE
  );

  return {
    savings,
    personalAccounts,
    investmentAccounts,
    isLoading,
  };
};

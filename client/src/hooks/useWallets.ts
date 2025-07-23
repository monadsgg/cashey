import { useQuery } from "@tanstack/react-query";
import { getWallets, type Wallet } from "../services/wallet";
import { useMemo } from "react";

export const useWallets = () => {
  const {
    data: wallets = [],
    isLoading,
    error,
  } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  const mainWallet = useMemo(
    () => wallets.find((item: Wallet) => item.type === "main"),
    [wallets]
  );

  const savingsWallet: Wallet[] = useMemo(
    () => wallets.filter((item: Wallet) => item.type === "savings"),
    [wallets]
  );

  return {
    wallets,
    mainWalletId: mainWallet?.id ?? null,
    savingsWallet,
    isLoading,
    error,
  };
};

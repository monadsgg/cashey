import { useQuery } from "@tanstack/react-query";
import { getWallets, type Wallet } from "../services/wallet";
import { useMemo } from "react";
import { WalletType } from "../constants";

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
    () => wallets.find((item: Wallet) => item.type === WalletType.MAIN),
    [wallets]
  );

  const accountWallets: Wallet[] = useMemo(
    () =>
      wallets.filter(
        (item: Wallet) =>
          item.type === WalletType.SAVINGS ||
          item.type === WalletType.INVESTMENT
      ),
    [wallets]
  );

  return {
    wallets,
    mainWalletId: mainWallet?.id ?? null,
    accountWallets,
    isLoading,
    error,
  };
};

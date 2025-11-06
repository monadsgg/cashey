import { useQuery } from "@tanstack/react-query";
import { getWallets, type Wallet } from "../../services/wallet";
import { WalletType } from "../../constants";

type WalletData = {
  mainWallet: Wallet | null;
  accountWallets: Wallet[];
};

export const useWallets = () => {
  const {
    data = { mainWallet: null, accountWallets: [] } as WalletData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallets"],
    queryFn: getWallets,
    select: (wallets: Wallet[]) => {
      const mainWallet = wallets.find((w) => w.type === WalletType.MAIN);
      const accountWallets = wallets.filter(
        (w) => w.type === WalletType.SAVINGS || w.type === WalletType.INVESTMENT
      );

      return { mainWallet, accountWallets };
    },
  });

  return {
    mainWallet: data.mainWallet,
    accountWallets: data.accountWallets,
    isLoading,
    error,
  };
};

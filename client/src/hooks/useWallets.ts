import { useQuery } from "@tanstack/react-query";
import { getWallets } from "../services/wallet";

export const useWallets = () => {
  const { data: wallets = [], isLoading } = useQuery<Wallet[]>({
    queryKey: ["wallets"],
    queryFn: getWallets,
  });

  const mainWallet = wallets.find((item: Wallet) => item.type === "main");

  const savingsWallet = wallets.filter((item) => item.type === "savings");

  if (!isLoading && !mainWallet) throw new Error("Main wallet not found");

  return {
    wallets,
    mainWalletId: mainWallet?.id,
    savingsWallet,
    isLoading,
  };
};

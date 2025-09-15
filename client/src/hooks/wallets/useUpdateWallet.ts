import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWallet, type WalletPayload } from "../../services/wallet";

export function useUpdateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: WalletPayload }) =>
      updateWallet(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

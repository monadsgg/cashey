import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferFunds } from "../../services/transactions";

export function useTransferFunds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transaction"] });
      queryClient.refetchQueries({ queryKey: ["all-transactions"] });
      queryClient.refetchQueries({ queryKey: ["accounts"] });
      queryClient.refetchQueries({ queryKey: ["accounts-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });
}

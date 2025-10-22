import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTransaction } from "../../services/transactions";

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.refetchQueries({ queryKey: ["statsOverview"] });
    },
  });
}

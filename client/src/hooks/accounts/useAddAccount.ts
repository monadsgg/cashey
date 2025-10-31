import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAccount } from "../../services/accounts";

export function useAddAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.refetchQueries({ queryKey: ["wallets"] });
      queryClient.refetchQueries({ queryKey: ["statsOverview"] });
    },
  });
}

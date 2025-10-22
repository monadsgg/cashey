import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "../../services/accounts";

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.refetchQueries({ queryKey: ["statsOverview"] });
    },
  });
}

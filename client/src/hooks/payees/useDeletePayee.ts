import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePayee } from "../../services/payees";

export function useDeletePayee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePayee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["Payee"],
      });
    },
  });
}

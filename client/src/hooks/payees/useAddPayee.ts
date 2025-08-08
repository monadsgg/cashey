import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPayee } from "../../services/payees";

export function useAddPayee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPayee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payees"],
      });
    },
  });
}

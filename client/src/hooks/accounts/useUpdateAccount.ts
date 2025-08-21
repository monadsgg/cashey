import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount, type AccountPayload } from "../../services/accounts";

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AccountPayload }) =>
      updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePayee, type PayeePayload } from "../../services/payees";

interface UpdatePayeeProps {
  id: number;
  payload: PayeePayload;
}

export function useUpdatePayee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdatePayeeProps) => updatePayee(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payees"],
      });
      queryClient.removeQueries({
        queryKey: ["transaction"],
      });
    },
  });
}

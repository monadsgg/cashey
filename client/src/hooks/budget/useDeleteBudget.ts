import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBugdet } from "../../services/budget";

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBugdet,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["budgets"],
      });
    },
  });
}

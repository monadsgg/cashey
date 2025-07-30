import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBugdet, type BudgetPayload } from "../../services/budget";

interface BudgetMutationProps {
  id: number;
  payload: BudgetPayload;
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: BudgetMutationProps) =>
      updateBugdet(id, payload),
    onSuccess: (data) => {
      console.log("updateMutate data:", data);
      queryClient.invalidateQueries({
        queryKey: ["budgets", data.month, data.year],
      });
    },
  });
}

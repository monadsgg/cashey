import { useMutation, useQueryClient } from "@tanstack/react-query";
import { copyBudget } from "../../services/budget";

interface CopyBudgetProps {
  fromMonth: string;
  toMonth: string;
}

export const useCopyBudget = () => {
  const queryClient = useQueryClient();

  return {
    mutation: useMutation({
      mutationFn: ({ fromMonth, toMonth }: CopyBudgetProps) =>
        copyBudget({ fromMonth, toMonth }),
      onSuccess: async (_data, variables) => {
        const { toMonth } = variables;
        const [year, month] = toMonth.split("-").map(Number);

        await queryClient.invalidateQueries({
          queryKey: ["budgets", month, year],
        });
      },
    }),
  };
};

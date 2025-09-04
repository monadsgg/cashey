import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategory } from "../../services/categories";

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-categories"],
      });
    },
  });
}

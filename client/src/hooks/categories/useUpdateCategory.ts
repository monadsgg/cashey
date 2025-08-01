import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateCategory,
  type CategoryPayload,
} from "../../services/categories";

interface UpdateCategoryProps {
  id: number;
  payload: CategoryPayload;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCategoryProps) =>
      updateCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTag } from "../../services/tags";

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
}

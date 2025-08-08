import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTag } from "../../services/tags";

export function useAddTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
    },
  });
}

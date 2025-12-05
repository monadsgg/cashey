import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTag, type TagPayload } from "../../services/tags";

interface UpdateTagProps {
  id: number;
  payload: TagPayload;
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTagProps) => updateTag(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tags"],
      });
      queryClient.removeQueries({
        queryKey: ["transaction"],
      });
    },
  });
}

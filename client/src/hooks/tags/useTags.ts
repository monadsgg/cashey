import { useQuery } from "@tanstack/react-query";
import { getTags, type Tag } from "../../services/tags";

export const useTags = () => {
  const { data: tags = [], isLoading } = useQuery<Tag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  return { tags, isLoading };
};

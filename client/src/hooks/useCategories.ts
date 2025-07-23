import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categories";

export type Category = {
  id: number;
  name: string;
  type: string;
  color: string;
};

export const useCategories = () => {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories, isLoading };
};

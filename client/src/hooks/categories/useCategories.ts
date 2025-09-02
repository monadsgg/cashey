import { useQuery } from "@tanstack/react-query";
import { getCategories, type Category } from "../../services/categories";

export const useCategories = () => {
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories, isCategoriesLoading };
};

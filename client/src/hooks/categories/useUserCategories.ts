import { useQuery } from "@tanstack/react-query";
import { type Category } from "../../services/categories";
import { getUserCategories } from "../../services/users";

export const useUserCategories = (id: number) => {
  const { data: userCategories = [], isLoading: isUserCategoriesLoading } =
    useQuery<Category[]>({
      queryKey: ["user-categories"],
      queryFn: () => getUserCategories(id),
    });

  return { userCategories, isUserCategoriesLoading };
};

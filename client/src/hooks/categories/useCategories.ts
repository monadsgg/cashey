import { useQuery } from "@tanstack/react-query";
import { getCategories, type Category } from "../../services/categories";
import { CategoryType } from "../../constants";

type CategoryData = {
  categories: Category[];
  incomeCategories: Category[];
  expenseCategories: Category[];
};

export const useCategories = () => {
  const {
    data = {
      categories: [],
      incomeCategories: [],
      expenseCategories: [],
    } as CategoryData,
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (categories: Category[]) => {
      const incomeCategories = categories.filter(
        (c) => c.type === CategoryType.INCOME
      );
      const expenseCategories = categories.filter(
        (c) => c.type === CategoryType.EXPENSE
      );

      return { categories, incomeCategories, expenseCategories };
    },
  });

  const { categories, incomeCategories, expenseCategories } = data;

  return {
    categories,
    incomeCategories,
    expenseCategories,
    isCategoriesLoading,
  };
};

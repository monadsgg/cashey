import Stack from "@mui/material/Stack";
import SummaryExpenseCategoryItem from "../../components/SummaryExpenseCategoryItem";

export type CategoryExpenseItem = {
  id: number;
  name: string;
  amountLimit: number;
  amountSpent: number;
  dotColor?: string;
};

interface SpendingByCategoryListProps {
  data: CategoryExpenseItem[];
}

function SpendingByCategoryList({ data }: SpendingByCategoryListProps) {
  console.log(data);

  return (
    <Stack flex={1} spacing={1}>
      {data.map((item) => {
        const percentage = Math.ceil(
          (item.amountSpent / item.amountLimit) * 100
        );
        return (
          <SummaryExpenseCategoryItem
            key={item.id}
            title={item.name}
            amount={item.amountSpent}
            percentage={percentage}
            isInBudget
            dotColor={item.dotColor}
          />
        );
      })}
    </Stack>
  );
}

export default SpendingByCategoryList;

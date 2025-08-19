import Stack from "@mui/material/Stack";
import SummaryExpenseCategoryItem from "../../components/SummaryExpenseCategoryItem";

export type CategoryExpenseItem = {
  id: number;
  name: string;
  amountSpent: number;
  dotColor: string;
};

interface SpendingByCategoryListProps {
  data: CategoryExpenseItem[];
}

function SpendingByCategoryList({ data }: SpendingByCategoryListProps) {
  return (
    <Stack sx={{ width: "50%" }}>
      {data.map((item) => {
        return (
          <SummaryExpenseCategoryItem
            key={item.id}
            title={item.name}
            amount={item.amountSpent}
            isInBudget
            dotColor={item.dotColor}
          />
        );
      })}
    </Stack>
  );
}

export default SpendingByCategoryList;

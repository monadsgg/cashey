import Box from "@mui/material/Box";
import SummaryExpenseCategoryItem from "../../components/SummaryExpenseCategoryItem";

export type CategoryExpenseItem = {
  id: number;
  name: string;
  amount: number;
  color: string;
};

interface SpendingByCategoryListProps {
  data: CategoryExpenseItem[];
}

function SpendingByCategoryList({ data }: SpendingByCategoryListProps) {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: `${
          data.length > 5 ? "repeat(2, 1fr)" : "repeat(1, 1fr)"
        }`,
        gap: 1.5,
      }}
    >
      {data.map((item) => {
        return (
          <SummaryExpenseCategoryItem
            key={item.id}
            title={item.name}
            amount={item.amount}
            isInBudget
            dotColor={item.color}
          />
        );
      })}
    </Box>
  );
}

export default SpendingByCategoryList;

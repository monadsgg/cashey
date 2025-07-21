import Stack from "@mui/material/Stack";
import SummaryListItem, { type SummaryListItemProps } from "./SummaryListItem";
import ProgressBar from "./ProgressBar";

interface SummaryExpenseCategoryItem extends SummaryListItemProps {
  isInBudget?: boolean;
  percentage: number;
  dotColor?: string;
}
function SummaryExpenseCategoryItem({
  title,
  amount,
  isInBudget,
  percentage,
  dotColor,
}: SummaryExpenseCategoryItem) {
  return (
    <Stack>
      <SummaryListItem
        dotColor={dotColor}
        title={title}
        amount={amount}
        textColor="black"
      />
      {/* TODO: Add progress bar here if the category is in budget */}
      {isInBudget && <ProgressBar value={percentage} />}
    </Stack>
  );
}

export default SummaryExpenseCategoryItem;

import { useMemo } from "react";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryTitle from "../../components/SummaryTitle";
import { useBudgets } from "../../hooks/budget/useBudgets";
import { getMonth, getYear } from "../../utils/dateUtils";
import SummaryListItem from "../../components/SummaryListItem";
import Stack from "@mui/material/Stack";

interface BudgetSummaryProps {
  currentDate: Date;
}

function BudgetSummary({ currentDate }: BudgetSummaryProps) {
  const month = Number(getMonth(currentDate, "M"));
  const year = Number(getYear(currentDate));
  const { budgets } = useBudgets(month, year);

  const budgetStats = useMemo(() => {
    const stats = { totalBudget: 0, totalSpent: 0, remaining: 0 };

    budgets.forEach((budget) => {
      stats.totalBudget += budget.amountLimit;
      stats.totalSpent += budget.amountSpent;
    });

    return { ...stats, remaining: stats.totalBudget - stats.totalSpent };
  }, [budgets]);

  const { totalBudget, totalSpent, remaining } = budgetStats;

  return (
    <SummaryContainer>
      <SummaryTitle title={`${getMonth(currentDate)} Summary`} />
      <Stack spacing={1}>
        <SummaryListItem title="Total Budget" amount={totalBudget} />
        <SummaryListItem title="Total Spent" amount={totalSpent} />
        <SummaryListItem title="Remaining" amount={remaining} />
      </Stack>
    </SummaryContainer>
  );
}

export default BudgetSummary;

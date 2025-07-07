import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { formatCurrency } from "../../utils/currencyUtils";

interface TransactionSummaryProps {
  currentMonth: string;
  transactions: TransactionItem[];
}

interface SummaryListItemProps {
  title: string;
  amount: number;
}

interface SummaryTitleProps {
  title: string;
}

interface SummaryExpenseCategoryItem extends SummaryListItemProps {
  isInBudget?: boolean;
}

type FinancialSummary = {
  income: number;
  expense: number;
  savings: number;
  remainingFunds: number;
};

type CategoryExpenseType = {
  category: string;
  amount: number;
};

function SummaryListItem({ title, amount }: SummaryListItemProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography color="secondary" sx={{ fontWeight: 500, fontSize: "18px" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "18px" }}>
        {formatCurrency(amount)}
      </Typography>
    </Stack>
  );
}

function SummaryTitle({ title }: SummaryTitleProps) {
  return (
    <Typography
      variant="subtitle1"
      sx={{ textTransform: "uppercase", textAlign: "center" }}
    >
      {title}
    </Typography>
  );
}

function SummaryExpenseCategoryItem({
  title,
  amount,
}: SummaryExpenseCategoryItem) {
  return (
    <Stack>
      <SummaryListItem title={title} amount={amount} />
      {/* TODO: Add progress bar here if the category is in budget */}
    </Stack>
  );
}

function TransactionSummary({
  currentMonth,
  transactions,
}: TransactionSummaryProps) {
  const { financialSummary, categoryExpense } = useMemo(() => {
    const summary = { income: 0, expense: 0, savings: 0 };

    const categoryMap = new Map<string, number>();

    // calculate all values
    transactions.forEach((transaction) => {
      const { category } = transaction;
      const amount = Number(transaction.amount);

      if (category.type === "income") summary.income += amount;
      if (category.type === "expense") {
        if (category.id === 15) summary.savings += amount;
        else summary.expense += amount;

        // build category breakdown for all expenses
        const categoryName = category.name;
        categoryMap.set(
          categoryName,
          (categoryMap.get(categoryName) || 0) + amount
        );
      }
    });

    const financialSummary: FinancialSummary = {
      ...summary,
      remainingFunds: summary.income - summary.expense - summary.savings,
    };

    const categoryExpense: CategoryExpenseType[] = Array.from(
      categoryMap.entries()
    ).map(([category, amount]) => ({ category, amount }));

    return { financialSummary, categoryExpense };
  }, [transactions]);

  const { income, expense, savings, remainingFunds } = financialSummary;

  return (
    <Stack
      spacing={3}
      sx={{ width: 400, border: "1px solid #ccc", p: 4, borderRadius: 4 }}
    >
      <SummaryTitle title={`${currentMonth} Summary`} />
      <Stack>
        <SummaryListItem title="Income" amount={income} />
        <SummaryListItem title="Expense" amount={expense} />
        <SummaryListItem title="Savings" amount={savings} />
        <SummaryListItem title="Remaining" amount={remainingFunds} />
      </Stack>
      <Stack spacing={1}>
        {categoryExpense.length > 0 && (
          <>
            <SummaryTitle title="Expenses by Category" />
            {categoryExpense.map((item) => (
              <SummaryExpenseCategoryItem
                key={item.category}
                title={item.category}
                amount={item.amount}
              />
            ))}
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default TransactionSummary;

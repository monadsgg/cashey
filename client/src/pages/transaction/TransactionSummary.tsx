import Stack from "@mui/material/Stack";
import { useMemo } from "react";
import { transferCategory } from "../app/appConstants";
import SummaryListItem from "../../components/SummaryListItem";
import SummaryTitle from "../../components/SummaryTitle";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryExpenseCategoryItem from "../../components/SummaryExpenseCategoryItem";
import type { TransactionItem } from "../../types";

interface TransactionSummaryProps {
  currentMonth: string;
  transactions: TransactionItem[];
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

      if (
        category.type === "income" &&
        category.id !== transferCategory.INCOMING_TRANSFER
      )
        summary.income += amount;
      if (category.type === "expense") {
        if (category.id === transferCategory.OUTGOING_TRANSFER)
          summary.savings += amount;
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
    <SummaryContainer>
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
    </SummaryContainer>
  );
}

export default TransactionSummary;

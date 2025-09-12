import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import SummaryListItem from "../../components/SummaryListItem";
import SummaryTitle from "../../components/SummaryTitle";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryExpenseCategoryItem from "../../components/SummaryExpenseCategoryItem";
import { transferCategory } from "../../constants";
import type { TransactionItem } from "../../services/transactions";

const ScrollableContainer = styled("div")(() => ({
  maxHeight: "50vh",
  overflowY: "hidden",
  [`&:hover`]: {
    overflowY: "auto",
  },
}));

interface TransactionSummaryProps {
  currentMonth: string;
  transactions: TransactionItem[];
}

type FinancialSummary = {
  income: number;
  fundsFromSavings: number;
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
    const summary = { income: 0, expense: 0, savings: 0, fundsFromSavings: 0 };

    const categoryMap = new Map<string, number>();

    // calculate all values
    transactions.forEach((transaction) => {
      const { category } = transaction;
      const amount = Number(transaction.amount);

      if (category.type === "income") {
        if (category.id === transferCategory.INCOMING_TRANSFER)
          summary.fundsFromSavings += amount;
        else summary.income += amount;
      }

      if (category.type === "expense") {
        if (category.id === transferCategory.OUTGOING_TRANSFER) {
          summary.savings += amount;
        } else {
          summary.expense += amount;

          // build category breakdown for all expenses
          const categoryName = category.name;
          categoryMap.set(
            categoryName,
            (categoryMap.get(categoryName) || 0) + amount
          );
        }
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

  const { income, expense, savings, fundsFromSavings, remainingFunds } =
    financialSummary;

  const overSpentAmount = remainingFunds + fundsFromSavings;

  return (
    <SummaryContainer>
      <SummaryTitle title={`${currentMonth} Summary`} />
      <Stack>
        <SummaryListItem title="Income" amount={income} />
        {!!fundsFromSavings && (
          <SummaryListItem
            title="Funds from savings"
            amount={fundsFromSavings}
          />
        )}
        <SummaryListItem title="Expense" amount={expense} />
        <SummaryListItem title="Savings" amount={savings} />
        <SummaryListItem
          title="Remaining from salary"
          amount={remainingFunds < 0 ? 0 : remainingFunds}
        />
        {overSpentAmount < 0 && (
          <SummaryListItem title="Overspent" amount={overSpentAmount} />
        )}
      </Stack>
      <Stack spacing={1}>
        {categoryExpense.length > 0 && (
          <>
            <SummaryTitle title="Expenses by Category" />
            <ScrollableContainer>
              {categoryExpense.map((item) => (
                <SummaryExpenseCategoryItem
                  key={item.category}
                  title={item.category}
                  amount={item.amount}
                />
              ))}
            </ScrollableContainer>
          </>
        )}
      </Stack>
    </SummaryContainer>
  );
}

export default TransactionSummary;

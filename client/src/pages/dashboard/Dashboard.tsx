import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StatCard from "./StatCard";
import Paper from "@mui/material/Paper";
import CategorySpendingChart from "./CategorySpendingChart";
import SpendingByCategoryList from "./SpendingByCategoryList";
import CircularProgress from "@mui/material/CircularProgress";
import NoDataContent from "./NoDataContent";
import { useState } from "react";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import { getMonth } from "../../utils/dateUtils";
import {
  addMonths,
  format,
  getYear,
  lastDayOfMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import { getUserName } from "../../utils/auth";
import { useAllTransactions } from "../../hooks/useAllTransactions";
import { useSpendingByCategory } from "../../hooks/reports/useSpendingByCategory";
import type { SpendingByCategoryResponse } from "../../services/reports";

const mockAccountsOverview = [
  {
    title: "Total Income",
    icon: TrendingUpIcon,
    amount: 0,
    caption: "This month",
    color: "green",
  },
  {
    title: "Total Expense",
    icon: TrendingDownIcon,
    amount: 0,
    caption: "This month",
    color: "red",
  },
  {
    title: "Total Savings",
    icon: SavingsIcon,
    amount: 0,
    caption: "43.7% savings rate",
    color: "blue",
  },
  {
    title: "Total Balance",
    icon: AccountBalanceWalletIcon,
    amount: 0,
    caption: "+2.5% from last month",
    color: "black",
  },
];

function Dashboard() {
  const [currentDate, setCurrentDate] = useState<Date | string>(new Date());
  const month = Number(getMonth(currentDate, "M"));
  const year = Number(getYear(currentDate));
  const { transactions } = useAllTransactions({
    startDate: format(startOfMonth(currentDate), "yyyy-MM-dd"),
    endDate: format(lastDayOfMonth(currentDate), "yyyy-MM-dd"),
  });
  const { spendingByCategory, isLoading } = useSpendingByCategory(month, year);

  console.log("transactions", transactions);

  const goToPreviousMonth = () => {
    const prevDate = subMonths(currentDate, 1);
    setCurrentDate(prevDate);
  };

  const goToNextMonth = () => {
    const nextDate = addMonths(currentDate, 1);
    setCurrentDate(nextDate);
  };

  const spendingByCategoryWidget = () => {
    if (isLoading) return <CircularProgress />;

    return (
      <Paper elevation={1} sx={{ p: 4, width: "50%" }}>
        <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
          Spending By Category
        </Typography>
        <Typography sx={{ textAlign: "center", opacity: 0.6 }}>
          This month's expense breakdown
        </Typography>

        {!isLoading && (
          <Stack
            direction="column-reverse"
            spacing={6}
            sx={{ p: 6, alignItems: "center" }}
          >
            <SpendingByCategoryList
              data={spendingByCategory.map((c: SpendingByCategoryResponse) => ({
                id: c.category.id,
                name: c.category.name,
                amountSpent: c.total,
                dotColor: c.category.color,
              }))}
            />
            <Box
              sx={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CategorySpendingChart
                data={spendingByCategory.map(
                  (c: SpendingByCategoryResponse) => ({
                    name: c.category.name,
                    amount: c.total,
                    color: c.category.color,
                  })
                )}
              />
            </Box>
          </Stack>
        )}
      </Paper>
    );
  };

  const displayReports = () => {
    if (spendingByCategory.length === 0) return <NoDataContent />;
    return spendingByCategoryWidget();
  };

  return (
    <Stack
      spacing={4}
      sx={(theme) => ({
        height: `calc(100vh - ${theme.spacing(6)} * 2)`,
      })}
    >
      <Stack
        flexDirection="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Stack>
          <Typography variant="h6">Welcome back, {getUserName()}!</Typography>
          <Typography variant="body1">
            Here's your financial overview for{" "}
            {`${getMonth(currentDate, "MMMM")} ${getYear(currentDate)}`}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            p: 1,
            borderRadius: 2,
          }}
        >
          <MonthNavigationHeader
            goToPrevMonth={goToPreviousMonth}
            goToNextMonth={goToNextMonth}
            currentDate={currentDate}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 3,
        }}
      >
        {mockAccountsOverview.map((acc) => (
          <StatCard
            key={acc.title}
            title={acc.title}
            color={acc.color}
            Icon={acc.icon}
            amount={acc.amount}
            caption={acc.caption}
          />
        ))}
      </Box>

      <Stack spacing={2}>{displayReports()}</Stack>
    </Stack>
  );
}

export default Dashboard;

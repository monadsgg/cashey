import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import StatCard from "./StatCard";
import Paper from "@mui/material/Paper";
import CategorySpendingChart from "./CategorySpendingChart";
import { useBudgets } from "../../hooks/useBudgets";
import SpendingByCategoryList, {
  type CategoryExpenseItem,
} from "./SpendingByCategoryList";
import type { BudgetItem } from "../../types";
import { useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const mockAccountsOverview = [
  {
    title: "Total Income",
    icon: TrendingUpIcon,
    amount: 3500,
    caption: "This month",
    color: "green",
  },
  {
    title: "Total Expense",
    icon: TrendingDownIcon,
    amount: 1900,
    caption: "This month",
    color: "red",
  },
  {
    title: "Total Savings",
    icon: SavingsIcon,
    amount: 1500,
    caption: "43.7% savings rate",
    color: "blue",
  },
  {
    title: "Total Balance",
    icon: AccountBalanceWalletIcon,
    amount: 5000,
    caption: "+2.5% from last month",
    color: "black",
  },
];

const thisMonthCategoryMockData = [
  { id: 1, name: "Groceries", amount: 650, percentage: 33.0, color: "#3b82f6" },
  { id: 2, name: "Utilities", amount: 380, percentage: 19.3, color: "#8b5cf6" },
  {
    id: 3,
    name: "Dining Out",
    amount: 320,
    percentage: 16.2,
    color: "#ef4444",
  },
  {
    id: 4,
    name: "Transportation",
    amount: 280,
    percentage: 14.2,
    color: "#10b981",
  },
  {
    id: 5,
    name: "Entertainment",
    amount: 245,
    percentage: 12.4,
    color: "#f59e0b",
  },
  { id: 6, name: "Healthcare", amount: 95, percentage: 4.8, color: "#ec4899" },
];

function Dashboard() {
  const month = 7;
  const year = 2025;
  const { budgets, isLoading } = useBudgets(month, year);

  console.log("budgets", budgets);

  const goToPreviousMonth = () => {};
  const goToNextMonth = () => {};
  return (
    <Stack
      spacing={4}
      sx={(theme) => ({
        // border: "1px solid red",
        height: `calc(100vh - ${theme.spacing(6)} * 2)`,
        padding: 2,
      })}
    >
      <Stack
        flexDirection="row"
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Stack>
          <Typography variant="h6">Welcome back, Mona!</Typography>
          <Typography variant="body1">
            Here's your financial overview for July 2025
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
          <Tooltip title="Previous month">
            <NavigateBeforeIcon onClick={goToPreviousMonth} />
          </Tooltip>
          <Typography variant="body1">This month: July 2025</Typography>
          <Tooltip title="Next month">
            <NavigateNextIcon onClick={goToNextMonth} />
          </Tooltip>
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

      <Paper elevation={16} sx={{ border: "1px solid red", p: 4 }}>
        <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
          Spending By Category
        </Typography>
        <Typography sx={{ textAlign: "center", opacity: 0.6 }}>
          This month's expense breakdown
        </Typography>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <Stack
            direction="row"
            spacing={6}
            sx={{ p: 6, justifyContent: "space-between" }}
          >
            <SpendingByCategoryList
              data={budgets.map((b: BudgetItem) => ({
                id: b.id,
                name: b.category.name,
                amountLimit: b.amountLimit,
                amountSpent: b.amountSpent,
              }))}
            />
            <Stack
              flexDirection="row"
              sx={{
                width: "30%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CategorySpendingChart
                data={thisMonthCategoryMockData.map((d) => ({
                  name: d.name,
                  amount: d.amount,
                  color: d.color,
                }))}
              />
            </Stack>
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}

export default Dashboard;

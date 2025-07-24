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
import SpendingByCategoryList from "./SpendingByCategoryList";
import CircularProgress from "@mui/material/CircularProgress";
import type { Category } from "../../services/categories";

type BudgetItem = {
  id: number;
  month: number;
  year: number;
  amountLimit: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  amountSpent: number;
  amountLeft: number;
};

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

function Dashboard() {
  const month = 7;
  const year = 2025;
  const { budgets, isLoading } = useBudgets(month, year);

  console.log("budgets", budgets);

  const goToPreviousMonth = () => {};
  const goToNextMonth = () => {};

  const spendingByCategoryWidget = () => {
    if (budgets.length === 0)
      return (
        <Typography sx={{ textAlign: "center", mt: 4 }}>
          No data yet. Proceed to transactions and budgets to add data
        </Typography>
      );

    if (isLoading) return <CircularProgress />;

    return (
      <>
        <Typography sx={{ textAlign: "center", opacity: 0.6 }}>
          This month's expense breakdown
        </Typography>

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
                dotColor: b.category.color,
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
                data={budgets.map((b: BudgetItem) => ({
                  name: b.category.name,
                  amount: b.amountSpent,
                  color: b.category.color,
                }))}
              />
            </Stack>
          </Stack>
        )}
      </>
    );
  };

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

      <Paper elevation={16} sx={{ p: 4 }}>
        <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
          Spending By Category
        </Typography>
        {spendingByCategoryWidget()}
      </Paper>
    </Stack>
  );
}

export default Dashboard;

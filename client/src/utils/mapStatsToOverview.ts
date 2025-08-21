import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

interface Stats {
  income: number;
  expense: number;
  savings: number;
  cashBalance: number;
  networth: number;
}

function getPercentageChange(current: number, prev?: number | null): string {
  if (!prev || prev === 0) {
    return "";
  }
  const diff = ((current - prev) / prev) * 100;
  return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}% from last month`;
}

const initialStats = {
  income: 0,
  expense: 0,
  savings: 0,
  cashBalance: 0,
  networth: 0,
};

export function mapStatsToOverview(
  stats: Stats = initialStats,
  prevStats?: Stats
) {
  return [
    {
      title: "Total Income",
      icon: TrendingUpIcon,
      amount: stats.income,
      caption: getPercentageChange(stats.income, prevStats?.income),
      color: "#72BF78",
    },
    {
      title: "Total Expense",
      icon: TrendingDownIcon,
      amount: stats.expense,
      caption: getPercentageChange(stats.expense, prevStats?.expense),
      color: "#FF8282",
    },
    {
      title: "Total Savings",
      icon: SavingsIcon,
      amount: stats.savings,
      caption: `${((stats.savings / (stats.income || 1)) * 100).toFixed(
        1
      )}% savings rate`,
      color: "#578FCA",
    },
    {
      title: "Total Cash Balance",
      icon: AccountBalanceWalletIcon,
      amount: stats.cashBalance,
      // caption: "+2.5% from last month", TODO: add caption
      color: "#76BA99",
    },
    {
      title: "Total Networth",
      icon: MonetizationOnIcon,
      amount: stats.networth,
      // caption: "+2.5% from last month",  TODO: add caption
      color: "#F08B51",
    },
  ];
}

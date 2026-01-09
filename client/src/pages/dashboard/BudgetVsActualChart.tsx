import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useBudgets } from "../../hooks/budget/useBudgets";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SpendingByCategoryWidgetProps {
  currentMonth: number;
  currentYear: number;
  spendingData: {
    id: number;
    name: string;
    amount: number;
    color: string;
  }[];
}

const MIN_MAX = 1800;
const STEP = 100;

function BudgetVsActualChart({
  currentMonth,
  currentYear,
  spendingData,
}: SpendingByCategoryWidgetProps) {
  const { budgets } = useBudgets(currentMonth, currentYear);

  const budgetMap = new Map(budgets.map((b) => [b.category.id, b.amountLimit]));

  const budgetAndActualData = spendingData
    .filter((c) => budgetMap.has(c.id))
    .map((c) => ({
      name: c.name,
      amount: c.amount,
      color: c.color,
      amountLimit: budgetMap.get(c.id) ?? 0,
    }));

  const budgetData = budgetAndActualData.map((d) => d.amountLimit);
  const actualData = budgetAndActualData.map((d) => d.amount);

  // Find highest value across all datasets
  const maxValue = Math.max(...budgetData, ...actualData);

  // Compute dynamic max (only grows above MIN_MAX)
  const yMax =
    maxValue <= MIN_MAX ? MIN_MAX : Math.ceil(maxValue / STEP) * STEP;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        min: 0,
        max: yMax,
        ticks: {
          stepSize: STEP,
          callback: (value: string | number) => `$${value}`,
        },
      },
    },
  };

  const chartData = {
    labels: budgetAndActualData.map((d) => d.name),
    datasets: [
      {
        label: "Budget",
        data: budgetData,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Actual",
        data: actualData,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Paper sx={{ p: 4, width: "50%" }}>
      <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
        Budget vs Actual Spending
      </Typography>
      <Typography sx={{ textAlign: "center", opacity: 0.6 }}>
        Monthly comparison of budgeted vs actual spending by category
      </Typography>

      <Box p={5} width="650px" height="500px">
        <Bar options={options} data={chartData} width={800} height={400} />
      </Box>
    </Paper>
  );
}

export default BudgetVsActualChart;

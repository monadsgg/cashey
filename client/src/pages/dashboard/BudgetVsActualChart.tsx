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

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
    },
    // title: {
    //   display: true,
    //   text: "Budget vs Actual Spending",
    // },
  },
};

function BudgetVsActualChart({
  currentMonth,
  currentYear,
  spendingData,
}: SpendingByCategoryWidgetProps) {
  const { budgets } = useBudgets(currentMonth, currentYear);

  const testData = spendingData
    .filter((c) => budgets.some((b) => b.category.id === c.id))
    .map((c) => ({
      name: c.name,
      amount: c.amount,
      color: c.color,
      amountLimit: budgets.find((b) => b.category.id === c.id)?.amountLimit,
    }));

  const chartData = {
    labels: testData.map((d) => d.name),
    datasets: [
      {
        label: "Budget",
        data: testData.map((d) => d.amountLimit),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Actual",
        data: testData.map((d) => d.amount),
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

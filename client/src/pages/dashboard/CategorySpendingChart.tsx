import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

type CategorySpending = {
  name: string;
  amount: number;
  color: string;
};

interface CategorySpendingChartProps {
  data: CategorySpending[];
}

function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: "Total expense",
        data: data.map((d) => d.amount),
        backgroundColor: data.map((d) => d.color),
      },
    ],
  };

  return (
    <Doughnut
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}

export default CategorySpendingChart;

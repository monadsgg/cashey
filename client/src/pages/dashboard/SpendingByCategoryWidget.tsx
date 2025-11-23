import { useMemo } from "react";
import type { SpendingByCategoryResponse } from "../../services/reports";
import { useSpendingByCategory } from "../../hooks/reports/useSpendingByCategory";
import CircularProgress from "@mui/material/CircularProgress";
import NoDataContent from "./NoDataContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import SpendingByCategoryList from "./SpendingByCategoryList";
import Box from "@mui/material/Box";
import CategorySpendingChart from "./CategorySpendingChart";

interface SpendingByCategoryWidgetProps {
  currentMonth: number;
  currentYear: number;
}

function SpendingByCategoryWidget({
  currentMonth,
  currentYear,
}: SpendingByCategoryWidgetProps) {
  const { spendingByCategory, isLoading } = useSpendingByCategory(
    currentMonth,
    currentYear
  );

  const spendingData = useMemo(
    () =>
      spendingByCategory
        .filter((c) => c.total > 0)
        .map((c: SpendingByCategoryResponse) => ({
          id: c.category.id,
          name: c.category.name,
          amountSpent: c.total,
          dotColor: c.category.color,
        })),
    [spendingByCategory]
  );

  const spendingByCategoryWidget = () => {
    if (isLoading) return <CircularProgress />;

    if (!spendingByCategory.length) return <NoDataContent />;

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
            <SpendingByCategoryList data={spendingData} />
            <Box
              sx={{
                width: "40%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CategorySpendingChart
                data={spendingByCategory
                  .filter((c) => c.total > 0)
                  .map((c: SpendingByCategoryResponse) => ({
                    name: c.category.name,
                    amount: c.total,
                    color: c.category.color,
                  }))}
              />
            </Box>
          </Stack>
        )}
      </Paper>
    );
  };

  return spendingByCategoryWidget();
}

export default SpendingByCategoryWidget;

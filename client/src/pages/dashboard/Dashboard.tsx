import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import StatCard from "./StatCard";
import { useMemo, useState } from "react";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import { getMonth } from "../../utils/date";
import { addMonths, getYear, subMonths } from "date-fns";
import { getUserName } from "../../utils/auth";
import { useStatsOverview } from "../../hooks/reports/useOverview";
import { mapStatsToOverview } from "../../utils/mapStatsToOverview";
import SpendingByCategoryWidget from "./SpendingByCategoryWidget";

function Dashboard() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const currentMonth = Number(getMonth(currentDate, "M"));
  const currentYear = Number(getYear(currentDate));

  const { statsOverview: stats } = useStatsOverview(currentMonth, currentYear);
  const { statsOverview: prevStats } = useStatsOverview(
    currentMonth - 1,
    currentYear
  );

  const overView = useMemo(
    () => mapStatsToOverview(stats, prevStats),
    [stats, prevStats]
  );

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

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
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 3,
        }}
      >
        {overView.map((acc) => (
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

      <Stack spacing={2}>
        <SpendingByCategoryWidget
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </Stack>
    </Stack>
  );
}

export default Dashboard;

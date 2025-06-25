import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format, startOfMonth, lastDayOfMonth } from "date-fns";
import TransactionTable from "./TransactionTable";
import { useEffect, useState } from "react";
import { getAllTransactions } from "../../services/transactions";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Tooltip from "@mui/material/Tooltip";
import {
  getFirstDayOfNextMonth,
  getFirstDayOfPrevMonth,
  getLastDayOfNextMonth,
  getLastDayOfPrevMonth,
  getCurrentMonth,
  getCurrentYear,
} from "../../utils/dateUtils";

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

function Transaction() {
  const [data, setData] = useState<TransactionItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(lastDayOfMonth(new Date()), "yyyy-MM-dd"),
  });
  const [currentTimeFrame, setCurrentTimeFrame] = useState({
    month: format(new Date(), "MMMM"),
    year: format(new Date(), "yyyy"),
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, pagination: paginationData } = await getAllTransactions(
        pagination.pageSize,
        pagination.page,
        dateRange.startDate,
        dateRange.endDate
      );
      setData(data);
      setPagination(paginationData);
    };
    fetchData();
  }, [pagination.page, dateRange.startDate, dateRange.endDate]);

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const goToPreviousMonth = () => {
    const startDate = getFirstDayOfPrevMonth(dateRange.startDate);
    const endDate = getLastDayOfPrevMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentTimeFrame({
      month: getCurrentMonth(startDate),
      year: getCurrentYear(startDate),
    });
  };

  const goToNextMonth = () => {
    const startDate = getFirstDayOfNextMonth(dateRange.startDate);
    const endDate = getLastDayOfNextMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentTimeFrame({
      month: getCurrentMonth(startDate),
      year: getCurrentYear(startDate),
    });
  };

  return (
    <Box sx={{ height: "100%", p: 3, border: "1px solid red" }}>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <Tooltip title="Previous month">
          <NavigateBeforeIcon onClick={goToPreviousMonth} />
        </Tooltip>
        <Typography variant="h2">
          {currentTimeFrame.month} {currentTimeFrame.year}
        </Typography>
        <Tooltip title="Next month">
          <NavigateNextIcon onClick={goToNextMonth} />
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={2}>
        <Stack sx={{ flexGrow: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Stack direction="row">
              <Button>Add Transaction</Button>
              <Button>Import/Export</Button>
            </Stack>
            <Stack direction="row">
              <Button>Search</Button>
              <Button>Setting</Button>
              <Button>Filter</Button>
            </Stack>
          </Stack>
          <TransactionTable
            transactions={data}
            totalCount={pagination.total}
            page={pagination.page}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            totalPages={pagination.totalPages}
          />
        </Stack>
        <Stack sx={{ width: 400, border: "1px solid #ccc", p: 2 }}>
          <Typography>{currentTimeFrame.month} Summary</Typography>
          <Stack>
            <Stack direction="row">
              <Typography>Income</Typography>
              <Typography>$2500</Typography>
            </Stack>
            <Stack direction="row">
              <Typography>Expense</Typography>
              <Typography>-$1000</Typography>
            </Stack>
            <Stack direction="row">
              <Typography>Savings</Typography>
              <Typography>$1000</Typography>
            </Stack>
            <Stack direction="row">
              <Typography>Remaining</Typography>
              <Typography>$500</Typography>
            </Stack>
          </Stack>
          <Stack>
            <Typography>Expenses by Category</Typography>
            <Stack>
              <Stack direction="row">
                <Typography>Rent</Typography>
                <Typography>$600</Typography>
              </Stack>
              <Typography>Slider here</Typography>
            </Stack>
            <Stack>
              <Stack direction="row">
                <Typography>Rent</Typography>
                <Typography>$600</Typography>
              </Stack>
              <Typography>Slider here</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default Transaction;

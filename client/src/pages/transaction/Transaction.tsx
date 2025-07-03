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
  getZonedDate,
} from "../../utils/dateUtils";
import TransactionForm, {
  type TransactionFormDataType,
} from "./TransactionForm";
import Dialog from "@mui/material/Dialog";
import SearchInputField from "../../components/SearchInputField";
import TransactionTableSettings from "./TransactionTableSettings";

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
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<TransactionFormDataType | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [settings, setSettings] = useState<TransactionTableSettingsType>({
    tag: false,
    payee: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, pagination: paginationData } = await getAllTransactions(
        pagination.pageSize,
        pagination.page,
        dateRange.startDate,
        dateRange.endDate,
        searchValue
      );
      setData(data);
      setPagination(paginationData);
    };
    fetchData();
  }, [pagination.page, dateRange.startDate, dateRange.endDate, searchValue]);

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

  const handleOnAddTransaction = (item: TransactionItem) => {
    const newData = [item, ...data];
    setData(newData);
  };

  const handleOnUpdateTransaction = (item: TransactionItem) => {
    const index = data.findIndex((trx) => trx.id === item.id);
    let newData = [...data];
    newData[index] = item;
    setData(newData);
    handleCloseForm();
  };

  const handleOnDeleteTransaction = (id: number) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    handleCloseForm();
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(null);
  };

  const handleOnClickActionBtn = (item: TransactionItem) => {
    const { id, category, description, date, amount, tag, payee } = item;
    handleOpenForm();
    setSelectedItem({
      id,
      description,
      date: getZonedDate(date),
      amount,
      categoryId: category.id,
      tagId: tag?.id || null,
      payeeId: payee?.id || null,
    });
  };

  const handleOnSearch = (keyword: string) => {
    setSearchValue(keyword);
  };

  const handleOnChangeTableSettings = (
    settings: TransactionTableSettingsType
  ) => {
    setSettings(settings);
  };

  return (
    <>
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
            <Stack
              direction="row"
              sx={{ p: "10px 0", justifyContent: "space-between" }}
            >
              <Stack direction="row">
                <Button variant="outlined" onClick={handleOpenForm}>
                  Add Transaction
                </Button>
                <Button variant="outlined">Import/Export</Button>
              </Stack>
              <Stack direction="row" spacing={1}>
                <SearchInputField onChange={handleOnSearch} />
                <TransactionTableSettings
                  settings={settings}
                  onChange={handleOnChangeTableSettings}
                />
                <Button variant="outlined" size="large">
                  Filter
                </Button>
              </Stack>
            </Stack>
            <TransactionTable
              transactions={data}
              totalCount={pagination.total}
              page={pagination.page}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              totalPages={pagination.totalPages}
              onClickActionBtn={handleOnClickActionBtn}
              settings={settings}
            />
          </Stack>
          <Stack sx={{ width: 400, border: "1px solid #ccc", p: 2 }}>
            {/* <Typography>{currentTimeFrame.month} Summary</Typography>
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
          </Stack> */}
          </Stack>
        </Stack>
      </Box>
      <Dialog
        closeAfterTransition={false}
        onClose={handleCloseForm}
        open={openForm}
        slotProps={{
          paper: {
            sx: {
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh",
              width: "25vw",
              m: 0,
              borderRadius: 0,
              maxHeight: "100%",
              p: "40px",
            },
          },
        }}
      >
        <TransactionForm
          title={`${selectedItem ? "Edit" : "Add"} transaction`}
          onAddTransaction={handleOnAddTransaction}
          onUpdateTransaction={handleOnUpdateTransaction}
          onDeleteTransaction={handleOnDeleteTransaction}
          onClose={handleCloseForm}
          selectedItem={selectedItem}
        />
      </Dialog>
    </>
  );
}

export default Transaction;

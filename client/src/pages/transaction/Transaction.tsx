import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { format, startOfMonth, lastDayOfMonth } from "date-fns";
import TransactionTable from "./TransactionTable";
import { useMemo, useState } from "react";
import {
  getAllTransactions,
  getTransactions,
  type TransactionItem,
} from "../../services/transactions";
import {
  getFirstDayOfNextMonth,
  getFirstDayOfPrevMonth,
  getLastDayOfNextMonth,
  getLastDayOfPrevMonth,
  getMonth,
  getYear,
  getZonedDate,
} from "../../utils/dateUtils";
import TransactionForm, {
  type TransactionFormDataType,
} from "./TransactionForm";
import SearchInputField from "../../components/SearchInputField";
import TransactionTableSettings, {
  type TransactionTableSettingsType,
} from "./TransactionTableSettings";
import TransactionSummary from "./TransactionSummary";
import { useQuery } from "@tanstack/react-query";
import TransferMoneyButton from "../../components/TransferMoneyButton";
import FormDialog from "../../components/FormDialog";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

function Transaction() {
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
  const [currentDate, setCurrentDate] = useState<Date | string>(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<TransactionFormDataType | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [settings, setSettings] = useState<TransactionTableSettingsType>({
    tag: false,
    payee: false,
  });

  const paginatedQueryKey = useMemo(
    () => [
      "transaction",
      pagination.page,
      dateRange.startDate,
      dateRange.endDate,
      searchValue,
    ],
    [pagination.page, dateRange.startDate, dateRange.endDate, searchValue]
  );

  // query for paginated transactions
  const { data: paginatedData } = useQuery({
    queryKey: paginatedQueryKey,
    queryFn: () =>
      getTransactions(
        pagination.pageSize,
        pagination.page,
        dateRange.startDate,
        dateRange.endDate,
        searchValue
      ),
  });

  const allTransactionQueryKey = useMemo(
    () => ["all-transactions", dateRange.startDate, dateRange.endDate],
    [dateRange.startDate, dateRange.endDate]
  );

  // fetch all transactions for summary
  const { data: allTransactions = [] } = useQuery({
    queryKey: allTransactionQueryKey,
    queryFn: () => getAllTransactions(dateRange.startDate, dateRange.endDate),
  });

  useMemo(() => {
    if (paginatedData?.pagination) {
      setPagination((prev) => ({
        ...prev,
        total: paginatedData.pagination.total,
        totalPages: paginatedData.pagination.totalPages,
      }));
    }
  }, [paginatedData]);

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const goToPreviousMonth = () => {
    const startDate = getFirstDayOfPrevMonth(dateRange.startDate);
    const endDate = getLastDayOfPrevMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentDate(startDate);
  };

  const goToNextMonth = () => {
    const startDate = getFirstDayOfNextMonth(dateRange.startDate);
    const endDate = getLastDayOfNextMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentDate(startDate);
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
      payee: payee || null,
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

  // const handleOnClickTransferBtn = () => {};

  const transactionData = paginatedData?.data || [];

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          height: `calc(100vh - ${theme.spacing(6)} * 2)`,
        })}
      >
        <MonthNavigationHeader
          goToPrevMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
          currentDate={currentDate}
        />

        <Stack direction="row" spacing={2} flexGrow={1}>
          <Stack sx={{ display: "flex", flex: 1 }}>
            <Stack
              direction="row"
              sx={{
                p: "10px 0",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row">
                <Button variant="outlined" onClick={handleOpenForm}>
                  Add Transaction
                </Button>
                {/* TO FOLLOW */}
                {/* <Button variant="outlined">Import/Export</Button> */}
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
              transactions={transactionData}
              totalCount={pagination.total}
              page={pagination.page}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              totalPages={pagination.totalPages}
              onClickActionBtn={handleOnClickActionBtn}
              settings={settings}
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <TransferMoneyButton label="Save money" />
            <TransactionSummary
              currentMonth={getMonth(currentDate)}
              transactions={allTransactions}
            />
          </Stack>
        </Stack>
      </Box>
      <FormDialog
        title={`${selectedItem ? "Edit" : "Add"} transaction`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <TransactionForm
          onClose={handleCloseForm}
          selectedItem={selectedItem}
        />
      </FormDialog>
    </>
  );
}

export default Transaction;

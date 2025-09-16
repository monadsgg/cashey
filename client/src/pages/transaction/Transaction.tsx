import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { format, startOfMonth, lastDayOfMonth } from "date-fns";
import TransactionTable from "./TransactionTable";
import { useMemo, useState } from "react";
import {
  getTransactions,
  type TransactionItem,
} from "../../services/transactions";
import {
  getFirstDayOfNextMonth,
  getFirstDayOfPrevMonth,
  getLastDayOfNextMonth,
  getLastDayOfPrevMonth,
  getMonth,
  getZonedDate,
} from "../../utils/date";
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
import ConfirmDialog from "../../components/ConfirmDialog";
import { useDeleteTransaction } from "../../hooks/transactions/useDeleteTransaction";
import { useAllTransactions } from "../../hooks/transactions/useAllTransactions";

import UploadFileDialog from "./UploadFileDialog";
import MainWalletBox from "./MainWalletBox";

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

export type ConfirmDeleteData = {
  id: null | number;
  openDialog: boolean;
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
    payee: true,
  });
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteData>({
    id: null,
    openDialog: false,
  });
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const { transactions: allTransactions } = useAllTransactions(dateRange);

  const deleteTransactionMutation = useDeleteTransaction();

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

  const resetPage = () => {
    setPagination({ ...pagination, page: 1 });
  };

  const goToPreviousMonth = () => {
    const startDate = getFirstDayOfPrevMonth(dateRange.startDate);
    const endDate = getLastDayOfPrevMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentDate(startDate);
    resetPage();
  };

  const goToNextMonth = () => {
    const startDate = getFirstDayOfNextMonth(dateRange.startDate);
    const endDate = getLastDayOfNextMonth(dateRange.startDate);
    setDateRange({ startDate, endDate });
    setCurrentDate(startDate);
    resetPage();
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedItem(null);
  };

  const handleOnClickEditBtn = (item: TransactionItem) => {
    const { id, category, description, date, amount, tags, payee, isRefund } =
      item;
    handleOpenForm();
    setSelectedItem({
      id,
      description,
      date: getZonedDate(date),
      amount,
      categoryId: category.id,
      tags: tags || [],
      payee: payee || null,
      isRefund: isRefund,
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

  const handleCloseConfirmDialog = () => {
    setConfirmDelete({ id: null, openDialog: false });
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setConfirmDelete({ id, openDialog: true });
  };

  const handleOnDeleteAcct = () => {
    if (!confirmDelete.id) return;
    deleteTransactionMutation.mutate(confirmDelete.id);
    handleCloseConfirmDialog();
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

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
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={handleOpenUploadDialog}>
                  Import
                </Button>
                <TransactionTableSettings
                  settings={settings}
                  onChange={handleOnChangeTableSettings}
                />
                <Button variant="outlined" size="large">
                  Filter
                </Button>
              </Stack>
              <Stack direction="row" spacing={1}>
                <SearchInputField onChange={handleOnSearch} />
                <TransferMoneyButton />
                <Button variant="outlined" onClick={handleOpenForm}>
                  Add Transaction
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
              onClickEditBtn={handleOnClickEditBtn}
              onClickDeleteBtn={handleOnClickDeleteBtn}
              settings={settings}
            />
          </Stack>
          <Stack direction="column" spacing={1}>
            <MainWalletBox />
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

      <ConfirmDialog
        title="transaction"
        open={confirmDelete.openDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteAcct}
      />

      <FormDialog
        title="Upload File"
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
      >
        <UploadFileDialog onClose={handleCloseUploadDialog} />
      </FormDialog>
    </>
  );
}

export default Transaction;

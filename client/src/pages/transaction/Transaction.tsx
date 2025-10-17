import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import TransactionTable from "./TransactionTable";
import {
  type TransactionFilters,
  type TransactionItem,
} from "../../services/transactions";
import {
  getCurrentMonthDateRange,
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
import TransferMoneyButton from "../../components/TransferMoneyButton";
import FormDialog from "../../components/FormDialog";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import ConfirmDialog from "../../components/ConfirmDialog";
import { useDeleteTransaction } from "../../hooks/transactions/useDeleteTransaction";
import { useAllTransactions } from "../../hooks/transactions/useAllTransactions";
import UploadFileDialog from "./UploadFileDialog";
import MainWalletBox from "./MainWalletBox";
import TransactionFilter from "./TransactionFilter";
import { useTransactions } from "../../hooks/transactions/useTransaction";
import type { SelectChangeEvent } from "@mui/material";
import type { TimeframeOption } from "../../utils/timeFrame";

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

export interface FilterCriteria {
  id: string;
  type: string;
  rule: string;
  value: string;
}

function hasAppliedFilters(filters: TransactionFilters | null) {
  if (!filters) return false;
  return Object.keys(filters).length > 0;
}

function Transaction() {
  const thisMonthRange = getCurrentMonthDateRange();
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [baseDateRange, setBaseDateRange] = useState<DateRange>(thisMonthRange);
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

  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria[] | null>([
    {
      id: Date.now().toString(),
      type: "",
      rule: "",
      value: "",
    },
  ]);
  const [appliedFilters, setAppliedFilters] =
    useState<TransactionFilters | null>(null);
  const [filterTimeFrame, setFilterTimeFrame] =
    useState<TimeframeOption | null>(null);

  const { transactions: paginatedData } = useTransactions(
    baseDateRange,
    pagination.page,
    searchValue,
    appliedFilters,
    filterTimeFrame
  );
  const { transactions: allTransactions } = useAllTransactions(baseDateRange);
  const deleteTransactionMutation = useDeleteTransaction();
  const hasFilters = hasAppliedFilters(appliedFilters);

  useEffect(() => {
    if (
      paginatedData &&
      typeof paginatedData === "object" &&
      "pagination" in paginatedData &&
      paginatedData.pagination
    ) {
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
    const startDate = getFirstDayOfPrevMonth(baseDateRange.startDate);
    const endDate = getLastDayOfPrevMonth(baseDateRange.startDate);
    setBaseDateRange({ startDate, endDate });
    setFilterTimeFrame(null);
    setCurrentDate(startDate);
    resetPage();
  };

  const goToNextMonth = () => {
    const startDate = getFirstDayOfNextMonth(baseDateRange.startDate);
    const endDate = getLastDayOfNextMonth(baseDateRange.startDate);
    setBaseDateRange({ startDate, endDate });
    setFilterTimeFrame(null);
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
    resetPage();
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

  const handleCloseFilterDialog = () => {
    setOpenFilterDialog(false);
  };

  const handleApplyFilter = (timeFrame: TimeframeOption) => {
    if (!activeFilters || !timeFrame.from || !timeFrame.to) return;

    const filterObj = Object.fromEntries(
      activeFilters
        .filter((item) => !!item.type || !!item.value)
        .map((item) => [item.type, { rule: item.rule, value: item.value }])
    );

    setAppliedFilters(filterObj);
    setFilterTimeFrame(timeFrame);
  };

  const handleAddFilter = () => {
    if (!activeFilters) return;

    setActiveFilters([
      ...activeFilters,
      { id: Date.now().toString(), type: "", rule: "", value: "" },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    if (!activeFilters) return;
    setActiveFilters(activeFilters.filter((f) => f.id !== id));
  };

  const handleDuplicateFilter = (id: string) => {
    if (!activeFilters) return;

    const filter = activeFilters.find((f) => f.id === id);
    if (filter) {
      setActiveFilters([
        ...activeFilters,
        { ...filter, id: Date.now().toString() },
      ]);
    }
  };

  const handleChangeFilter = (item: FilterCriteria) => {
    if (!activeFilters) return;

    setActiveFilters(
      activeFilters.map((filter) => (filter.id === item.id ? item : filter))
    );
  };

  const handleChangeFilterValue = (id: string, val: string) => {
    if (!activeFilters) return;

    setActiveFilters(
      activeFilters.map((filter) =>
        filter.id === id ? { ...filter, value: val } : filter
      )
    );
  };

  const handleChangeFilterRule = (id: string, e: SelectChangeEvent) => {
    if (!activeFilters) return;

    const rule = e.target.value;

    setActiveFilters(
      activeFilters.map((filter) =>
        filter.id === id ? { ...filter, rule } : filter
      )
    );
  };

  const handleResetFilter = () => {
    setActiveFilters([
      {
        id: Date.now().toString(),
        type: "",
        rule: "",
        value: "",
      },
    ]);
    setAppliedFilters(null);
    setFilterTimeFrame(null);
  };

  const renderTable = () => {
    let data: TransactionItem[] | [] = [];

    if (
      paginatedData &&
      typeof paginatedData === "object" &&
      "pagination" in paginatedData &&
      paginatedData.pagination
    ) {
      data = paginatedData.data;
    }

    return (
      <TransactionTable
        hasFilter={hasFilters}
        onResetFilter={handleResetFilter}
        transactions={data}
        totalCount={pagination.total}
        page={pagination.page}
        pageSize={pagination.pageSize}
        onPageChange={handlePageChange}
        totalPages={pagination.totalPages}
        onClickEditBtn={handleOnClickEditBtn}
        onClickDeleteBtn={handleOnClickDeleteBtn}
        settings={settings}
      />
    );
  };

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
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setOpenFilterDialog(true)}
                >
                  {appliedFilters && Object.keys(appliedFilters).length > 0 ? (
                    <Badge
                      color="primary"
                      badgeContent={Object.keys(appliedFilters).length}
                    >
                      Filter
                    </Badge>
                  ) : (
                    "Filter"
                  )}
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
            {renderTable()}
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

      <FormDialog
        title="Transaction Filters"
        open={openFilterDialog}
        onClose={handleCloseFilterDialog}
        paperSx={{ width: "60vw" }}
      >
        <TransactionFilter
          filters={activeFilters}
          onClose={handleCloseFilterDialog}
          onAddFilter={handleAddFilter}
          onRemoveFilter={handleRemoveFilter}
          onDuplicateFilter={handleDuplicateFilter}
          onChangeFilter={handleChangeFilter}
          onChangeFilterValue={handleChangeFilterValue}
          onChangeFilterRule={handleChangeFilterRule}
          onApplyFilters={handleApplyFilter}
          selectedTimeFrame={filterTimeFrame}
        />
      </FormDialog>
    </>
  );
}

export default Transaction;

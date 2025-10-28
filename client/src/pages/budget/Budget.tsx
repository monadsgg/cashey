import { useMemo, useState } from "react";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import BudgetTable from "./BudgetTable";
import { addMonths, subMonths } from "date-fns";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FormDialog from "../../components/FormDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import BudgetForm, { type BudgetFormData } from "./BudgetForm";
import type { BudgetItem } from "../../services/budget";
import { useDeleteBudget } from "../../hooks/budget/useDeleteBudget";
import { useCopyBudget } from "../../hooks/budget/useCopyBudget";
import BudgetSummary from "./BudgetSummary";
import { formatDate } from "../../utils/date";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useSnackbar } from "notistack";
import { getErrorMessage } from "../../utils/errorMessage";
import { useCategories } from "../../hooks/categories/useCategories";
import type { Category } from "../../services/categories";
import { CategoryType } from "../../constants";

function Budget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetFormData | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { categories } = useCategories();
  const deleteMutation = useDeleteBudget();
  const { mutation: copyBudgetMutation } = useCopyBudget();

  const { enqueueSnackbar } = useSnackbar();

  const expenseCategories = useMemo(() => {
    let expenseCategoryArr: Category[] = [];

    categories.forEach((c) => {
      if (c.type === CategoryType.EXPENSE) expenseCategoryArr.push(c);
    });

    return expenseCategoryArr;
  }, [categories]);

  const goToPrevMonth = () => {
    const prevDate = subMonths(currentDate, 1);
    setCurrentDate(prevDate);
  };

  const goToNextMonth = () => {
    const nextDate = addMonths(currentDate, 1);
    setCurrentDate(nextDate);
  };

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleOnClickEditBtn = (item: BudgetItem) => {
    setSelectedItem({
      id: item.id,
      categoryId: item.category.id,
      amountLimit: item.amountLimit.toString(),
      month: item.month,
      year: item.year,
    });
    handleOpenForm();
  };

  const handleOnDeleteItem = () => {
    if (!selectedId) return;
    deleteMutation.mutate(selectedId);
    handleCloseConfirmDialog();
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setSelectedId(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setSelectedItem(null);
  };

  const handleCopyBudget = async () => {
    const fromMonth = formatDate(subMonths(currentDate, 1), "yyyy-MM");
    const toMonth = formatDate(currentDate, "yyyy-MM");

    try {
      const result = await copyBudgetMutation.mutateAsync({
        fromMonth,
        toMonth,
      });

      enqueueSnackbar(result.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "row",
          gap: 2,
          height: `calc(100vh - ${theme.spacing(6)} * 2)`,
        })}
      >
        <Stack direction="column" spacing={2} flexGrow={1}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <MonthNavigationHeader
              goToPrevMonth={goToPrevMonth}
              goToNextMonth={goToNextMonth}
              currentDate={currentDate}
            />
            <Stack direction="row" spacing={2}>
              <Tooltip title="Copy Last Month's Budget">
                <IconButton
                  aria-label="copy budget button"
                  color="primary"
                  sx={{
                    border: "1px solid",
                    borderColor: "primary",
                    borderRadius: "6px",
                    p: "0 10px",
                  }}
                  onClick={handleCopyBudget}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
              <Button variant="outlined" onClick={handleOpenForm}>
                Add Budget
              </Button>
            </Stack>
          </Stack>

          <BudgetTable
            isCopyProcessing={copyBudgetMutation.isPending}
            currentDate={currentDate}
            onClickEditBtn={handleOnClickEditBtn}
            onClickDeleteBtn={handleOnClickDeleteBtn}
          />
        </Stack>
        <Stack>
          <BudgetSummary currentDate={currentDate} />
        </Stack>
      </Box>

      <FormDialog
        title={`${selectedItem ? "Edit" : "Add"} budget`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <BudgetForm
          currentDate={currentDate}
          onClose={handleCloseForm}
          selectedItem={selectedItem}
          categories={expenseCategories}
        />
      </FormDialog>

      <ConfirmDialog
        title="budget"
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteItem}
      />
    </>
  );
}

export default Budget;

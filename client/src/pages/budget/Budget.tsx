import { useState } from "react";
import MonthNavigationHeader from "../../components/MonthNavigationHeader";
import BudgetTable from "./BudgetTable";
import { addMonths, subMonths } from "date-fns";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import FormDialog from "../../components/FormDialog";
import BudgetForm, { type BudgetFormData } from "./BudgetForm";
import type { BudgetItem } from "../../services/budget";
import { useDeleteBudget } from "../../hooks/budget/useDeleteBudget";
import ConfirmDialog from "../../components/ConfirmDialog";
import BudgetSummary from "./BudgetSummary";

function Budget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetFormData | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const deleteMutation = useDeleteBudget();

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
      amountLimit: item.amountLimit,
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
            <Button variant="outlined" onClick={handleOpenForm}>
              Add Budget
            </Button>
          </Stack>

          <BudgetTable
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

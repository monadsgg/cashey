import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCategories } from "../../../hooks/categories/useCategories";
import FormDialog from "../../../components/FormDialog";
import CategoryForm, { type CategoryFormData } from "./CategoryForm";
import { useState } from "react";
import { CategoryType } from "../../../constants";
import type { Category } from "../../../services/categories";
import ListItemBox from "../../../components/ListItemBox";
import Box from "@mui/material/Box";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteCategory } from "../../../hooks/categories/useDeleteCategory";

const boxSxProps = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 3,
};

type ConfirmDeleteData = {
  id: null | number;
  openDialog: boolean;
};

function Categories() {
  const [selectedItem, setSelectedItem] = useState<CategoryFormData | null>(
    null
  );
  const [openForm, setOpenForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<ConfirmDeleteData>({
    id: null,
    openDialog: false,
  });
  const { categories } = useCategories();
  const deleteMutation = useDeleteCategory();

  const incomeCategories = categories.filter(
    (c) => c.type === CategoryType.INCOME
  );

  const expenseCategories = categories.filter(
    (c) => c.type === CategoryType.EXPENSE
  );

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const handleOnClickEditBtn = (item: Category) => {
    setSelectedItem({
      id: item.id,
      name: item.name,
      color: item.color,
      isIncome: item.type === CategoryType.INCOME,
    });
    handleOpenForm();
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDelete({ id: null, openDialog: false });
  };

  const handleOnDeleteItem = () => {
    if (!confirmDelete.id) return;
    deleteMutation.mutate(confirmDelete.id);
    handleCloseConfirmDialog();
  };

  const handleOnClickDeleteBtn = (id: number) => {
    setConfirmDelete({ id, openDialog: true });
  };

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <Stack>
            <Typography>Categories</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Organize your expenses and income by category.
            </Typography>
          </Stack>
          <Button variant="contained" onClick={handleOpenForm}>
            Add Category
          </Button>
        </Stack>

        <Stack>
          <Typography variant="subtitle1">Income</Typography>
          <Box sx={boxSxProps}>
            {incomeCategories.map((category: Category) => (
              <ListItemBox
                key={category.id}
                item={category}
                onClickDelete={handleOnClickDeleteBtn}
                onClickEdit={handleOnClickEditBtn}
              />
            ))}
          </Box>
        </Stack>

        <Stack>
          <Typography variant="subtitle1">Expense</Typography>
          <Box sx={boxSxProps}>
            {expenseCategories.map((category: Category) => (
              <ListItemBox
                key={category.id}
                item={category}
                onClickDelete={handleOnClickDeleteBtn}
                onClickEdit={handleOnClickEditBtn}
              />
            ))}
          </Box>
        </Stack>
      </Stack>

      <FormDialog
        title={`${selectedItem ? "Edit" : "Add"} category`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <CategoryForm selectedItem={selectedItem} onClose={handleCloseForm} />
      </FormDialog>

      <ConfirmDialog
        title="category"
        open={confirmDelete.openDialog}
        onClose={handleCloseConfirmDialog}
        onClickDelete={handleOnDeleteItem}
      />
    </>
  );
}

export default Categories;

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCategories } from "../../../hooks/categories/useCategories";
import FormDialog from "../../../components/FormDialog";
import CategoryForm, { type CategoryFormData } from "./CategoryForm";
import { CategoryType } from "../../../constants";
import type { Category } from "../../../services/categories";
import ListItemBox from "../../../components/ListItemBox";
import Box from "@mui/material/Box";
import ConfirmDialog from "../../../components/ConfirmDialog";
import { useDeleteCategory } from "../../../hooks/categories/useDeleteCategory";
import { useUserCategories } from "../../../hooks/categories/useUserCategories";
import { getUserId } from "../../../utils/auth";

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

  const userId = getUserId();
  const { incomeCategories, expenseCategories } = useCategories();
  const { userCategories } = useUserCategories(userId!);
  const deleteMutation = useDeleteCategory();

  // remove user categories from income and expense categories
  const userCategoryIds = new Set(userCategories.map((c) => c.id));
  const filteredIncomeCategories = incomeCategories.filter(
    (c) => !userCategoryIds.has(c.id)
  );
  const filteredExpenseCategories = expenseCategories.filter(
    (c) => !userCategoryIds.has(c.id)
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

        <Stack
          spacing={3}
          sx={{
            height: "65vh",
            overflowY: "auto",
            pr: 1,
          }}
        >
          <Stack>
            <Typography variant="subtitle1" fontSize={16} color="primary">
              Pre-defined Categories
            </Typography>
            <Typography variant="subtitle1">Income</Typography>
            <Box sx={boxSxProps}>
              {filteredIncomeCategories.map((category) => (
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
              {filteredExpenseCategories.map((category) => (
                <ListItemBox
                  key={category.id}
                  item={category}
                  onClickDelete={handleOnClickDeleteBtn}
                  onClickEdit={handleOnClickEditBtn}
                />
              ))}
            </Box>
          </Stack>

          {userCategories.length > 0 && (
            <Stack>
              <Typography variant="subtitle1" fontSize={16} color="primary">
                My categories
              </Typography>
              <Box sx={boxSxProps}>
                {userCategories.map((category) => (
                  <ListItemBox
                    key={category.id}
                    item={category}
                    onClickDelete={handleOnClickDeleteBtn}
                    onClickEdit={handleOnClickEditBtn}
                  />
                ))}
              </Box>
            </Stack>
          )}
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

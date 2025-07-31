import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useCategories } from "../../../hooks/useCategories";
import FormDialog from "../../../components/FormDialog";
import CategoryForm, { type CategoryFormData } from "./CategoryForm";
import { useState } from "react";

function Categories() {
  const [selectedItem, setSelectedItem] = useState<CategoryFormData | null>(
    null
  );
  const [openForm, setOpenForm] = useState(false);
  const { categories } = useCategories();

  console.log(categories);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <>
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

      <FormDialog
        title={`${selectedItem ? "Edit" : "Add"} category`}
        onClose={handleCloseForm}
        open={openForm}
      >
        <CategoryForm selectedItem={selectedItem} onClose={handleCloseForm} />
      </FormDialog>
    </>
  );
}

export default Categories;

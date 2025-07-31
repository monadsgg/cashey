import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextInputField from "../../../components/TextInputField";
import { useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useCategories } from "../../../hooks/categories/useCategories";
import { CategoryType } from "../../../constants";
import { useAddCategory } from "../../../hooks/categories/useAddCategory";
import { useUpdateCategory } from "../../../hooks/categories/useUpdateCategory";

interface CategoryFormProps {
  selectedItem: CategoryFormData | null;
  onClose: () => void;
}

export interface CategoryFormData {
  id?: number;
  name: string;
  color: string;
  isIncome: boolean;
}

function CategoryForm({ onClose, selectedItem }: CategoryFormProps) {
  const initialFormData: CategoryFormData = {
    name: "",
    color: "#66CDAA",
    isIncome: false,
  };
  const [formData, setFormData] = useState<CategoryFormData>(
    selectedItem ?? initialFormData
  );
  const [error, setError] = useState("");
  const { categories } = useCategories();
  const existingCategories = categories
    .filter((c) => !selectedItem || c.id !== selectedItem.id)
    .map((c) => c.name.toLowerCase());

  const addMutation = useAddCategory();
  const updateMutation = useUpdateCategory();

  const handleSubmit = () => {
    const { name, color, isIncome } = formData;

    if (existingCategories.includes(name.toLowerCase())) {
      setError("Category already exists.");
      return;
    }

    const payload = {
      name,
      type: isIncome ? CategoryType.INCOME : CategoryType.EXPENSE,
      color,
    };

    if (formData?.id) {
      updateMutation.mutate({ id: formData.id, payload });
    } else {
      addMutation.mutate(payload);
    }

    setFormData({ ...formData, name: "", isIncome: false });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setError("");
  };

  const isDisabled = !formData.name || !!error;

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <TextInputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextInputField
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              type="color"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isIncome}
                  onChange={handleSwitchChange}
                  name="isIncome"
                />
              }
              label="Treat as income"
              labelPlacement="start"
            />
            {error && (
              <Stack>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onClose} color="primary">
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              {!selectedItem ? "Add " : "Save "}
              Category
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
}

export default CategoryForm;

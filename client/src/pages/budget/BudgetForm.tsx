import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { getMonth, getYear } from "../../utils/dateUtils";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import type { SelectChangeEvent } from "@mui/material/Select";
import SelectInputField from "../../components/SelectInputField";
import TextInputField from "../../components/TextInputField";
import { useBudgets } from "../../hooks/budget/useBudgets";
import { useAddBudget } from "../../hooks/budget/useAddBudget";
import { useUpdateBudget } from "../../hooks/budget/useUpdateBudget";

interface BudgetFormProps {
  currentDate: Date;
  selectedItem: BudgetFormData | null;
  onClose: () => void;
}

export interface BudgetFormData {
  id?: number;
  categoryId: number;
  amountLimit: number;
  month: number;
  year: number;
}

function BudgetForm({ currentDate, selectedItem, onClose }: BudgetFormProps) {
  const initialFormData: BudgetFormData = {
    categoryId: 3,
    amountLimit: 0,
    month: Number(getMonth(currentDate, "M")),
    year: Number(getYear(currentDate)),
  };
  const [formData, setFormData] = useState<BudgetFormData>(
    selectedItem ?? initialFormData
  );
  const [error, setError] = useState("");
  const { categories } = useCategories();
  const { budgets } = useBudgets(formData.month, formData.year);
  const existingBudgets = budgets.map((b) => b.category.id);

  const addMutation = useAddBudget();
  const updateMutation = useUpdateBudget();

  const handleSubmit = () => {
    const { categoryId, amountLimit, month, year } = formData;

    // check if the selected category is already existed
    if (existingBudgets.includes(categoryId)) {
      setError("Category already exists.");
      return;
    }

    if (Number(amountLimit) <= 0) {
      setError("Amount should be greater than 0");
      return;
    }

    const payload = {
      categoryId: Number(categoryId),
      amountLimit: Number(amountLimit),
      month,
      year,
    };

    if (formData?.id) {
      console.log("handleSubmit update");
      updateMutation.mutate({ id: formData.id, payload });
    } else {
      addMutation.mutate(payload);
    }

    setFormData({ ...formData, amountLimit: 0 });
    onClose();
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const isDisabled =
    !formData.categoryId || formData.amountLimit <= 0 || !!error;

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            {categories.length > 0 && (
              <SelectInputField
                label="Category"
                name="categoryId"
                value={formData.categoryId.toString()}
                onChange={handleFormChange}
              >
                {categories.map((category) => {
                  return (
                    <MenuItem value={category.id}>{category.name}</MenuItem>
                  );
                })}
              </SelectInputField>
            )}
            <TextInputField
              label="Amount Limit "
              name="amountLimit"
              value={formData.amountLimit}
              onChange={handleFormChange}
              type="number"
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
              Budget
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
}

export default BudgetForm;

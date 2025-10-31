import { useState } from "react";
import { getMonth, getYear } from "../../utils/date";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import type { SelectChangeEvent } from "@mui/material/Select";
import SelectInputField from "../../components/SelectInputField";
import TextInputField from "../../components/TextInputField";
import { useBudgets } from "../../hooks/budget/useBudgets";
import { useAddBudget } from "../../hooks/budget/useAddBudget";
import { useUpdateBudget } from "../../hooks/budget/useUpdateBudget";
import type { Category } from "../../services/categories";
import { BudgetFormSchema } from "../../schemas/budgetSchema";
import type z from "zod";
import { getZodIssueObj } from "../../utils/validators";

interface BudgetFormProps {
  currentDate: Date;
  selectedItem: BudgetFormData | null;
  categories: Category[];
  onClose: () => void;
}

export type BudgetFormData = z.infer<typeof BudgetFormSchema>;

function BudgetForm({
  currentDate,
  selectedItem,
  categories,
  onClose,
}: BudgetFormProps) {
  const initialFormData: BudgetFormData = {
    categoryId: categories[0].id,
    amountLimit: "",
    month: Number(getMonth(currentDate, "M")),
    year: Number(getYear(currentDate)),
  };
  const [formData, setFormData] = useState<BudgetFormData>(
    selectedItem ?? initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { budgets } = useBudgets(formData.month, formData.year);
  const existingBudgets = budgets.map((b) => b.category.id);

  const addMutation = useAddBudget();
  const updateMutation = useUpdateBudget();

  const handleSubmit = () => {
    // validate data
    const result = BudgetFormSchema.safeParse(formData);

    if (result.success) {
      const { categoryId, amountLimit, month, year } = result.data;

      // check if the selected category is already existed
      if (existingBudgets.includes(categoryId)) {
        setErrors({ categoryId: "Category already exists" });
        return;
      }

      const payload = {
        categoryId: Number(categoryId),
        amountLimit: Number(amountLimit),
        month,
        year,
      };

      if (formData?.id) {
        updateMutation.mutate({ id: formData.id, payload });
      } else {
        addMutation.mutate(payload);
      }

      setFormData({ ...formData, amountLimit: "" });
      onClose();
    } else {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors({ ...errors, ...newError });
      });
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

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
                error={errors.categoryId}
                disabled={!!formData?.id}
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
              error={!!errors.amountLimit}
              helperText={errors.amountLimit}
            />
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
              disabled={Object.keys(errors).length > 0}
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

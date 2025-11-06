import { useMemo, useState } from "react";
import Stack from "@mui/material/Stack";
import DatePickerField from "../../components/DatePickerField";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import MenuItem from "@mui/material/MenuItem";
import { type SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import { formatDate } from "../../utils/date";
import Divider from "@mui/material/Divider";
import { useWallets } from "../../hooks/wallets/useWallets";
import { useCategories } from "../../hooks/categories/useCategories";
import DialogContent from "@mui/material/DialogContent";
import type { Payee } from "../../services/payees";
import TransactionPayeeField from "./TransactionPayeeField";
import TransactionTagField from "./TransactionTagField";
import type { Tag } from "../../services/tags";
import { useAddTransaction } from "../../hooks/transactions/useAddTransaction";
import { useUpdateTransaction } from "../../hooks/transactions/useUpdateTransaction";
import ListSubheader from "@mui/material/ListSubheader";
import type { Category } from "../../services/categories";
import { CategoryType } from "../../constants";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Box from "@mui/material/Box";
import z from "zod";
import { getZodIssueObj } from "../../utils/validators";
import { TransactionFormSchema } from "../../schemas/transactionSchema";

interface TransactionFormProps {
  onClose: () => void;
  isLoading?: boolean;
  selectedItem: TransactionFormData | null;
}

export type TransactionFormData = z.infer<typeof TransactionFormSchema>;

function TransactionForm({
  onClose,
  isLoading,
  selectedItem,
}: TransactionFormProps) {
  const initialFormData: TransactionFormData = {
    description: "",
    date: new Date(),
    categoryId: 1,
    amount: "",
    payee: null,
    tags: [],
    isRefund: false,
  };
  const [formData, setFormData] = useState<TransactionFormData>(
    selectedItem ?? initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mainWallet } = useWallets();
  const { categories, isCategoriesLoading } = useCategories();
  const addTransactionMutation = useAddTransaction();
  const updateTransactionMutation = useUpdateTransaction();

  const { incomeCategories, expenseCategories } = useMemo(() => {
    let incomeCategories: Category[] = [];
    let expenseCategories: Category[] = [];

    categories.forEach((category) => {
      if (category.type === CategoryType.EXPENSE) {
        expenseCategories.push(category);
      } else if (category.type === CategoryType.INCOME) {
        incomeCategories.push(category);
      }
    });

    return { incomeCategories, expenseCategories };
  }, [categories]);

  const handleSubmit = async () => {
    // validate data
    const result = TransactionFormSchema.safeParse(formData);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors({ ...errors, ...newError });
      });
    } else {
      const { description, amount, date, categoryId, payee, tags, isRefund } =
        result.data;

      const payloadData = {
        description,
        amount: Number(amount),
        categoryId,
        payeeId: payee?.id ?? null,
        tagIds: tags.map((t) => t.id),
        date: formatDate(date),
        walletId: mainWallet?.id as number,
        isRefund,
      };

      if (formData?.id) {
        updateTransactionMutation.mutate({
          id: formData.id,
          payload: payloadData,
        });
      } else {
        addTransactionMutation.mutate(payloadData);
        setFormData({
          ...formData,
          description: "",
          amount: "",
          payee: null,
          tags: [],
          isRefund: false,
        });
      }

      onClose();
      setErrors({});
    }
  };

  const handleDateChange = (value: Date) => {
    setFormData({ ...formData, date: value });
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleFormSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayeeChange = (value: Payee) => {
    setFormData({ ...formData, payee: value });
  };

  const handleTagChange = (values: Tag[]) => {
    setFormData({ ...formData, tags: values });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  if (isCategoriesLoading)
    return (
      <Box
        sx={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <DialogContent>
      <Stack spacing={4} sx={{ height: "100%" }}>
        <Stack spacing={2} sx={{ flexGrow: 1 }}>
          <DatePickerField value={formData.date} onChange={handleDateChange} />
          <TextInputField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormDataChange}
          />
          {categories.length > 0 && (
            <SelectInputField
              label="Category"
              name="categoryId"
              value={formData.categoryId.toString()}
              onChange={handleFormSelectChange}
            >
              <ListSubheader>Income</ListSubheader>
              {incomeCategories.map((c) => {
                return (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                );
              })}
              <ListSubheader>Expense</ListSubheader>
              {expenseCategories.map((c) => {
                return (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                );
              })}
            </SelectInputField>
          )}

          <TextInputField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleFormDataChange}
            error={!!errors.amount}
            helperText={errors.amount}
          />

          <TransactionPayeeField
            label="Payee"
            selectedValue={formData.payee}
            onChange={handlePayeeChange}
          />

          <TransactionTagField
            label="Tag"
            selectedValue={formData.tags}
            onChange={handleTagChange}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.isRefund}
                onChange={handleSwitchChange}
                name="isRefund"
              />
            }
            label="Is it a refund?"
            labelPlacement="start"
          />
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={onClose}
            color="primary"
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            {!selectedItem ? "Add " : "Save "}
            Transaction
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  );
}

export default TransactionForm;

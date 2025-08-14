import { useState } from "react";
import Stack from "@mui/material/Stack";
import DatePickerField from "../../components/DatePickerField";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import MenuItem from "@mui/material/MenuItem";
import { type SelectChangeEvent } from "@mui/material/Select";
import Button from "@mui/material/Button";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  type TransactionPayload,
} from "../../services/transactions";
import { formatDate } from "../../utils/dateUtils";
import Divider from "@mui/material/Divider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWallets } from "../../hooks/useWallets";
import ErrorMessage from "../../components/ErrorMessage";
import { useCategories } from "../../hooks/categories/useCategories";
import DialogContent from "@mui/material/DialogContent";
import type { Payee } from "../../services/payees";
import TransactionPayeeField from "./TransactionPayeeField";

export type TransactionFormDataType = {
  id?: number;
  description: string;
  date: Date;
  categoryId: number;
  amount: number;
  payee: Payee | null;
  tagId: number | null;
};

interface TransactionFormProps {
  formData?: TransactionFormDataType;
  onClose: () => void;
  isLoading?: boolean;
  selectedItem: TransactionFormDataType | null;
}

function TransactionForm({
  onClose,
  isLoading,
  selectedItem,
}: TransactionFormProps) {
  const initialFormData: TransactionFormDataType = {
    description: "",
    date: new Date(),
    categoryId: 1,
    amount: 0,
    payee: null,
    tagId: null,
  };
  const [formData, setFormData] = useState<TransactionFormDataType>(
    selectedItem ?? initialFormData
  );
  const { mainWalletId, error } = useWallets();
  const { categories } = useCategories();

  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: TransactionPayload;
    }) => updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      onClose();
    },
  });

  const handleSubmit = async () => {
    const { description, amount, date, categoryId, payee, tagId } = formData;
    const formattedDate = formatDate(date, "yyyy-MM-dd");

    if (!mainWalletId)
      return <ErrorMessage message="Main wallet is not found" />;

    const payloadData = {
      description,
      amount,
      categoryId,
      payeeId: typeof payee === "object" && payee !== null ? payee.id : null,
      tagId,
      date: formattedDate,
      walletId: mainWalletId,
    };

    if (formData?.id) {
      updateMutation.mutate({ id: formData.id, payload: payloadData });
    } else {
      addMutation.mutate(payloadData);

      setFormData({
        ...formData,
        description: "",
        amount: 0,
        payee: null,
        tagId: null,
      });
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleDateChange = (value: Date) => {
    setFormData({ ...formData, date: value });
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePayeeChange = (value: Payee) => {
    setFormData({ ...formData, payee: value });
  };

  const isDisabled = formData.description === "" || formData.amount <= 0;

  if (error) return <ErrorMessage message={error.message} />;

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
              {categories.map((category) => {
                return <MenuItem value={category.id}>{category.name}</MenuItem>;
              })}
            </SelectInputField>
          )}

          <TextInputField
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleFormDataChange}
          />

          <TransactionPayeeField
            label="Payee"
            selectedValue={formData.payee}
            onChange={handlePayeeChange}
          />
        </Stack>
        {selectedItem && (
          <Stack>
            <Button
              color="secondary"
              variant="contained"
              onClick={() => handleDeleteTransaction(selectedItem.id!)}
            >
              Delete transaction
            </Button>
          </Stack>
        )}
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
            disabled={isDisabled}
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

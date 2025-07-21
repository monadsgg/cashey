import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import DatePickerField from "../../components/DatePickerField";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import MenuItem from "@mui/material/MenuItem";
import { type SelectChangeEvent } from "@mui/material/Select";
import { getCategories } from "../../services/categories";
import Button from "@mui/material/Button";
import { getWallets } from "../../services/wallet";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../../services/transactions";
import { formatDate } from "../../utils/dateUtils";
import Divider from "@mui/material/Divider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type TransactionFormDataType = {
  id?: number;
  description: string;
  date: Date;
  categoryId: number;
  amount: number;
  payeeId: number | null;
  tagId: number | null;
};

interface TransactionFormProps {
  title: string;
  formData?: TransactionFormDataType;
  onClose: () => void;
  isLoading?: boolean;
  selectedItem: TransactionFormDataType | null;
}

function TransactionForm({
  title,
  onClose,
  isLoading,
  selectedItem,
}: TransactionFormProps) {
  const initialFormData: TransactionFormDataType = {
    description: "",
    date: new Date(),
    categoryId: 2,
    amount: 0,
    payeeId: null,
    tagId: null,
  };
  const [formData, setFormData] = useState<TransactionFormDataType>(
    selectedItem ?? initialFormData
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [mainWalletId, setMainWalletId] = useState(0);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getCategories();
      setCategories(result);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchWallets = async () => {
      const result = await getWallets();
      const mainWalletId = result.find(
        (item: Wallet) => item.type === "main"
      )?.id;

      setMainWalletId(mainWalletId);
    };

    fetchWallets();
  }, []);

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
    const { description, amount, date, categoryId, payeeId, tagId } = formData;
    const formattedDate = formatDate(date, "yyyy-MM-dd");

    const payloadData = {
      description,
      amount,
      categoryId,
      payeeId,
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
        payeeId: null,
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

  const isDisabled = formData.description === "" || formData.amount <= 0;

  return (
    <Stack spacing={4} sx={{ height: "100%" }}>
      <Typography variant="h3">{title}</Typography>
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
  );
}

export default TransactionForm;

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DatePickerField from "./DatePickerField";
import TextInputField from "./TextInputField";
import SelectInputField from "./SelectInputField";
import { useWallets } from "../hooks/useWallets";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { formatDate } from "../utils/dateUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferFunds } from "../services/transactions";

interface TransferMoneyFormProps {
  onClose: () => void;
}

type TransferMoneyFormData = {
  description: string;
  date: Date;
  amount: number;
  fromWalletId: number | null;
  toWalletId: number | null;
};

function TransferMoneyForm({ onClose }: TransferMoneyFormProps) {
  const { mainWalletId, savingsWallet, isLoading } = useWallets();
  const initialFormData: TransferMoneyFormData = {
    description: "",
    date: new Date(),
    amount: 0,
    fromWalletId: null,
    toWalletId: null,
  };
  const [formData, setFormData] =
    useState<TransferMoneyFormData>(initialFormData);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && mainWalletId) {
      setFormData({
        ...formData,
        fromWalletId: mainWalletId,
        toWalletId: savingsWallet[0].id ?? null,
      });
    }
  }, [isLoading]);

  const addMutation = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction"] });
      queryClient.invalidateQueries({ queryKey: ["all-transactions"] });
      queryClient.refetchQueries({ queryKey: ["savings"] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const { description, date, amount, fromWalletId, toWalletId } = formData;
    const formattedDate = formatDate(date, "yyyy-MM-dd");

    if (!amount || !fromWalletId || !toWalletId) {
      setError("Amount, from/to account is required");
      return;
    }

    const payloadData = {
      description,
      amount: Number(amount),
      date: formattedDate,
      fromWalletId,
      toWalletId,
    };

    addMutation.mutate(payloadData);
  };

  const handleDateChange = (value: Date) => {
    setFormData({ ...formData, date: value });
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleFormSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isDisabled =
    savingsWallet.length === 0 || formData.amount === 0 || !!error;

  return (
    <Stack spacing={4} sx={{ height: "100%" }}>
      <Typography variant="h3">Transfer Funds</Typography>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <DatePickerField
          disabled
          value={formData.date}
          onChange={handleDateChange}
        />
        <TextInputField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleFormDataChange}
        />

        {!isLoading && (
          <>
            {formData.fromWalletId && (
              <SelectInputField
                label="From Account"
                name="fromWalletId"
                value={formData.fromWalletId?.toString()}
                onChange={handleFormSelectChange}
              >
                <MenuItem value={mainWalletId}>Main Wallet</MenuItem>
              </SelectInputField>
            )}

            {savingsWallet.length > 0 && formData.toWalletId && (
              <SelectInputField
                label="To Account"
                name="toWalletId"
                value={formData.toWalletId?.toString()}
                onChange={handleFormSelectChange}
              >
                {savingsWallet.map((item) => {
                  return <MenuItem value={item.id}>{item.name}</MenuItem>;
                })}
              </SelectInputField>
            )}
          </>
        )}
        <TextInputField
          label="Amount"
          name="amount"
          value={formData.amount}
          onChange={handleFormDataChange}
        />
      </Stack>
      {savingsWallet.length === 0 && (
        <Stack>
          <Alert severity="error">
            You need to add at least one savings account before you can transfer
            any funds.
          </Alert>
        </Stack>
      )}
      {error && (
        <Stack>
          <Alert severity="error">{error}</Alert>
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
          Transfer
        </Button>
      </Stack>
    </Stack>
  );
}

export default TransferMoneyForm;

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
import CircularProgress from "@mui/material/CircularProgress";
import ErrorMessage from "./ErrorMessage";

interface TransferMoneyFormProps {
  onClose: () => void;
  isSavings?: boolean;
}

type TransferMoneyFormData = {
  description: string;
  date: Date;
  amount: number;
  fromWalletId: number | null;
  toWalletId: number | null;
};

function TransferMoneyForm({ onClose, isSavings }: TransferMoneyFormProps) {
  const { mainWalletId, savingsWallet, isLoading, error } = useWallets();
  const initialFormData: TransferMoneyFormData = {
    description: "",
    date: new Date(),
    amount: 0,
    fromWalletId: null,
    toWalletId: null,
  };
  const [formData, setFormData] =
    useState<TransferMoneyFormData>(initialFormData);
  const [errorForm, setErrorForm] = useState("");
  const [savingsWalletList, setSavingsWalletList] = useState(savingsWallet);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading) {
      setFormData((prev) => ({
        ...prev,
        fromWalletId: isSavings ? savingsWallet[0].id : mainWalletId,
        toWalletId: isSavings ? mainWalletId : savingsWallet[0].id,
      }));
      setSavingsWalletList(savingsWallet);
    }
  }, [isLoading, mainWalletId]);

  useEffect(() => {
    if (isSavings) {
      const newSavings = savingsWallet.filter(
        (s) => s.id !== formData.fromWalletId
      );
      setSavingsWalletList(newSavings);
    }
  }, [formData.fromWalletId]);

  const addMutation = useMutation({
    mutationFn: transferFunds,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transaction"] });
      queryClient.refetchQueries({ queryKey: ["all-transactions"] });
      queryClient.refetchQueries({ queryKey: ["savings"] });
      queryClient.refetchQueries({ queryKey: ["savings-transactions"] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const { description, date, amount, fromWalletId, toWalletId } = formData;
    const formattedDate = formatDate(date, "yyyy-MM-dd");

    if (!amount || !fromWalletId || !toWalletId) {
      setErrorForm("Amount, from/to account is required");
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
    setErrorForm("");
  };

  const handleFormSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) return <CircularProgress />;
  if (!mainWalletId) return <ErrorMessage message="Main wallet is not found" />;

  const isDisabled =
    savingsWallet?.length === 0 ||
    formData.amount === 0 ||
    !!error ||
    addMutation.isPending;

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

        {formData.fromWalletId && (
          <SelectInputField
            label="From Account"
            name="fromWalletId"
            value={formData.fromWalletId?.toString()}
            onChange={handleFormSelectChange}
          >
            {!isSavings && (
              <MenuItem value={mainWalletId}>Main Wallet</MenuItem>
            )}
            {isSavings &&
              savingsWallet.map((item) => {
                return <MenuItem value={item.id}>{item.name}</MenuItem>;
              })}
          </SelectInputField>
        )}

        {savingsWallet.length > 0 && formData.toWalletId && (
          <SelectInputField
            label="To Account"
            name="toWalletId"
            value={formData.toWalletId?.toString()}
            onChange={handleFormSelectChange}
          >
            {isSavings && <MenuItem value={mainWalletId}>Main Wallet</MenuItem>}
            {savingsWalletList.map((item) => {
              return <MenuItem value={item.id}>{item.name}</MenuItem>;
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
          <Alert severity="error">{errorForm}</Alert>
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

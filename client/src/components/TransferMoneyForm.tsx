import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import DatePickerField from "./DatePickerField";
import TextInputField from "./TextInputField";
import SelectInputField from "./SelectInputField";
import DialogContent from "@mui/material/DialogContent";
import { useWallets } from "../hooks/wallets/useWallets";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { formatDate } from "../utils/date";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorMessage from "./ErrorMessage";
import { useTransferFunds } from "../hooks/transactions/useTransferFunds";

interface TransferMoneyFormProps {
  onClose: () => void;
  isAccounts?: boolean;
}

type TransferMoneyFormData = {
  description: string;
  date: Date;
  amount: number;
  fromWalletId: number | null;
  toWalletId: number | null;
};

function TransferMoneyForm({ onClose, isAccounts }: TransferMoneyFormProps) {
  const { mainWalletId, accountWallets, isLoading, error } = useWallets();
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
  const [accountWalletsList, setaccountWalletsList] = useState(accountWallets);

  useEffect(() => {
    if (!isLoading) {
      setFormData((prev) => ({
        ...prev,
        fromWalletId: isAccounts ? accountWallets[0].id : mainWalletId,
        toWalletId: isAccounts ? mainWalletId : accountWallets[0].id,
      }));
      setaccountWalletsList(accountWallets);
    }
  }, [isLoading, mainWalletId]);

  useEffect(() => {
    if (isAccounts) {
      const newAccounts = accountWallets.filter(
        (s) => s.id !== formData.fromWalletId
      );
      setaccountWalletsList(newAccounts);
    }
  }, [formData.fromWalletId]);

  const transferFundsMutation = useTransferFunds();

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

    transferFundsMutation.mutate(payloadData);

    setFormData({ ...formData, amount: 0, description: "" });
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
    accountWallets?.length === 0 ||
    formData.amount === 0 ||
    !!error ||
    transferFundsMutation.isPending;

  return (
    <DialogContent>
      <Stack spacing={4} sx={{ height: "100%" }}>
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
              {!isAccounts && (
                <MenuItem value={mainWalletId}>Main Wallet</MenuItem>
              )}
              {isAccounts &&
                accountWallets.map((item) => {
                  return <MenuItem value={item.id}>{item.name}</MenuItem>;
                })}
            </SelectInputField>
          )}

          {accountWallets.length > 0 && formData.toWalletId && (
            <SelectInputField
              label="To Account"
              name="toWalletId"
              value={formData.toWalletId?.toString()}
              onChange={handleFormSelectChange}
            >
              {isAccounts && (
                <MenuItem value={mainWalletId}>Main Wallet</MenuItem>
              )}
              {accountWalletsList.map((item) => {
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

        {accountWallets.length === 0 && (
          <Stack>
            <Alert severity="error">
              You need to add at least one account before you can transfer any
              funds.
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
    </DialogContent>
  );
}

export default TransferMoneyForm;

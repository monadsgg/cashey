import { useState } from "react";
import { useTransferFunds } from "../hooks/transactions/useTransferFunds";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import DatePickerField from "./DatePickerField";
import TextInputField from "./TextInputField";
import SelectInputField from "./SelectInputField";
import DialogContent from "@mui/material/DialogContent";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import { formatDate } from "../utils/date";
import { type SelectChangeEvent } from "@mui/material/Select";
import type { Wallet } from "../services/wallet";
import { TransferMoneyFormSchema } from "../schemas/transactionSchema";
import { getZodIssueObj } from "../utils/validators";
import z from "zod";

interface TransferMoneyFormProps {
  mainWallet: Wallet;
  accountWallets: Wallet[];
  onClose: () => void;
  isAccounts?: boolean;
}

export type TransferMoneyData = z.infer<typeof TransferMoneyFormSchema>;

function TransferMoneyForm({
  mainWallet,
  accountWallets,
  onClose,
  isAccounts,
}: TransferMoneyFormProps) {
  const initialFormData: TransferMoneyData = {
    description: "",
    date: new Date(),
    amount: "",
    fromWalletId: isAccounts ? accountWallets[0].id : mainWallet.id,
    toWalletId: isAccounts ? mainWallet.id : accountWallets[0].id,
  };
  const [formData, setFormData] = useState<TransferMoneyData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const transferFundsMutation = useTransferFunds();

  const fromWalletOptions = isAccounts ? accountWallets : [mainWallet];
  const toWalletOptions = !isAccounts
    ? accountWallets
    : [mainWallet, ...accountWallets].filter(
        (w) => w.id !== formData.fromWalletId
      );

  const handleSubmit = () => {
    // validate data
    const result = TransferMoneyFormSchema.safeParse(formData);

    if (result.success) {
      const { description, fromWalletId, toWalletId, amount, date } =
        result.data;
      const payloadData = {
        description,
        amount: Number(amount),
        date: formatDate(date),
        fromWalletId,
        toWalletId,
      };
      transferFundsMutation.mutate(payloadData);
      setFormData({ ...formData, amount: "", description: "" });
      onClose();
    } else {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors({ ...errors, ...newError });
      });
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
              {fromWalletOptions.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
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
              {toWalletOptions.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
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
        </Stack>

        {accountWallets.length === 0 && (
          <Stack>
            <Alert severity="error">
              You need to add at least one account before you can transfer any
              funds.
            </Alert>
          </Stack>
        )}

        <Divider />

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose} color="primary">
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={!!errors.amount || !accountWallets.length}
          >
            Transfer
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  );
}

export default TransferMoneyForm;

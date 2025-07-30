import { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { INVESTMENT_TYPE, InvestmentType, WalletType } from "../../constants";
import Alert from "@mui/material/Alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAccount,
  deleteAccount,
  updateAccount,
  type AccountPayload,
} from "../../services/accounts";
import DialogContent from "@mui/material/DialogContent";

interface AccountFormProps {
  onClose: () => void;
  selectedAccount?: AccountFormDataType | null;
}

export type AccountFormDataType = AccountPayload & {
  id?: number;
};

function AccountForm({ onClose, selectedAccount }: AccountFormProps) {
  const initialFormData: AccountFormDataType = {
    name: "",
    balance: 0,
    owner: "",
    targetAmt: 0,
    accountType: WalletType.SAVINGS,
    investmentType: InvestmentType.TFSA,
    contributionLimit: null,
  };
  const [formData, setFormData] = useState<AccountFormDataType>(
    selectedAccount ?? initialFormData
  );
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.refetchQueries({ queryKey: ["wallets"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AccountPayload }) =>
      updateAccount(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
  });

  const handleSubmit = () => {
    const {
      name,
      balance,
      owner,
      targetAmt,
      accountType,
      investmentType,
      contributionLimit,
    } = formData;

    if (!name || !owner || !targetAmt || !accountType) {
      setError("Name, owner, target amount and account type is required");
      return;
    }

    const payload = {
      name,
      balance,
      owner,
      targetAmt,
      accountType,
      investmentType:
        accountType === WalletType.SAVINGS ? null : investmentType,
      contributionLimit: contributionLimit || null,
    };

    if (formData.id) {
      updateMutation.mutate({ id: formData.id, payload: payload });
    } else {
      addMutation.mutate(payload);
      setFormData({
        ...formData,
        name: "",
        balance: 0,
        owner: "",
        targetAmt: 0,
      });
    }
  };

  const handleDeleteAccount = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <DialogContent>
      <Stack spacing={4} sx={{ height: "100%" }}>
        <Stack>
          <TextInputField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormDataChange}
          />
          <TextInputField
            label="Balance"
            name="balance"
            value={formData.balance}
            onChange={handleFormDataChange}
          />
          <TextInputField
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleFormDataChange}
          />
          <TextInputField
            label="Target Amount"
            name="targetAmt"
            value={formData.targetAmt}
            onChange={handleFormDataChange}
          />
          <SelectInputField
            label="Account Type"
            name="accountType"
            value={formData.accountType}
            onChange={handleFormSelectChange}
          >
            <MenuItem value={WalletType.SAVINGS}>Personal Savings</MenuItem>;
            <MenuItem value={WalletType.INVESTMENT}>Investment</MenuItem>;
          </SelectInputField>
          {formData.accountType === WalletType.INVESTMENT && (
            <>
              <SelectInputField
                label="Investment Type"
                name="investmentType"
                value={formData.investmentType ?? undefined}
                onChange={handleFormSelectChange}
              >
                {Object.entries(INVESTMENT_TYPE).map(([key, value]) => {
                  return (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  );
                })}
              </SelectInputField>
              <TextInputField
                label="Contribution Limit"
                name="contributionLimit"
                value={formData.contributionLimit ?? null}
                onChange={handleFormDataChange}
              />
            </>
          )}
        </Stack>
        {error && (
          <Stack>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
        {selectedAccount && (
          <Stack spacing={1}>
            <Button color="primary" variant="outlined" onClick={handleSubmit}>
              Save changes
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => handleDeleteAccount(selectedAccount.id!)}
            >
              Delete this account
            </Button>
          </Stack>
        )}
        <Divider />
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose} color="primary">
            Close
          </Button>
          {!selectedAccount && (
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
              disabled={!!error}
            >
              Add
            </Button>
          )}
        </Stack>
      </Stack>
    </DialogContent>
  );
}

export default AccountForm;

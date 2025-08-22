import { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { INVESTMENT_TYPE, InvestmentType, WalletType } from "../../constants";
import Alert from "@mui/material/Alert";
import { type AccountPayload } from "../../services/accounts";
import DialogContent from "@mui/material/DialogContent";
import { useAddAccount } from "../../hooks/accounts/useAddAccount";
import { useUpdateAccount } from "../../hooks/accounts/useUpdateAccount";

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
  const addAccountMutation = useAddAccount();
  const updateAccountMutation = useUpdateAccount();

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
      updateAccountMutation.mutate({ id: formData.id, payload: payload });
    } else {
      addAccountMutation.mutate(payload);
      setFormData({
        ...formData,
        name: "",
        balance: 0,
        owner: "",
        targetAmt: 0,
      });
    }

    onClose();
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

        <Divider />

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose} color="primary">
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={!!error}
          >
            {!selectedAccount ? "Add " : "Save "}
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  );
}

export default AccountForm;

import { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { INVESTMENT_TYPE, InvestmentType, WalletType } from "../../constants";
import DialogContent from "@mui/material/DialogContent";
import { useAddAccount } from "../../hooks/accounts/useAddAccount";
import { useUpdateAccount } from "../../hooks/accounts/useUpdateAccount";
import { AccountFormSchema } from "../../schemas/accountSchema";
import type z from "zod";
import { getZodIssueObj } from "../../utils/validators";

interface AccountFormProps {
  onClose: () => void;
  selectedAccount?: AccountFormData | null;
}

export type AccountFormData = z.infer<typeof AccountFormSchema>;

function AccountForm({ onClose, selectedAccount }: AccountFormProps) {
  const initialFormData: AccountFormData = {
    name: "",
    balance: "",
    owner: "",
    targetAmt: "",
    accountType: WalletType.SAVINGS,
    investmentType: InvestmentType.TFSA,
    contributionLimit: null,
  };
  const [formData, setFormData] = useState<AccountFormData>(
    selectedAccount ?? initialFormData
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addAccountMutation = useAddAccount();
  const updateAccountMutation = useUpdateAccount();

  const handleSubmit = () => {
    // validate form data
    const result = AccountFormSchema.safeParse(formData);

    if (result.success) {
      const {
        name,
        balance,
        owner,
        targetAmt,
        accountType,
        investmentType,
        contributionLimit,
      } = result.data;

      const payload = {
        name,
        balance: Number(balance),
        owner,
        targetAmt: Number(targetAmt),
        accountType,
        investmentType:
          accountType === WalletType.SAVINGS ? null : investmentType,
        contributionLimit: Number(contributionLimit) || null,
      };

      if (formData.id) {
        updateAccountMutation.mutate({ id: formData.id, payload: payload });
      } else {
        addAccountMutation.mutate(payload);
        setFormData({
          ...formData,
          name: "",
          balance: "",
          owner: "",
          targetAmt: "",
        });
      }

      onClose();
    } else {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors((prev) => ({ ...prev, ...newError }));
      });
    }
  };

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // remove error text by curr field
    setErrors((prev) => {
      const { [name]: _, ...rest } = prev; // destructure and get other error obj exc curr field
      return rest;
    });
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
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextInputField
            label="Balance"
            name="balance"
            value={formData.balance}
            onChange={handleFormDataChange}
            error={!!errors.balance}
            helperText={errors.balance}
          />
          <TextInputField
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleFormDataChange}
            error={!!errors.owner}
            helperText={errors.owner}
          />
          <TextInputField
            label="Target Amount"
            name="targetAmt"
            value={formData.targetAmt}
            onChange={handleFormDataChange}
            error={!!errors.targetAmt}
            helperText={errors.targetAmt}
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
                value={formData.contributionLimit ?? ""}
                onChange={handleFormDataChange}
              />
            </>
          )}
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose} color="primary">
            Close
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
          >
            {!selectedAccount ? "Add " : "Save "}
          </Button>
        </Stack>
      </Stack>
    </DialogContent>
  );
}

export default AccountForm;

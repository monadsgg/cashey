import { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextInputField from "../../components/TextInputField";
import SelectInputField from "../../components/SelectInputField";
import { type SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  INVESTMENT_SAVING_TYPE,
  INVESTMENT_TYPE,
  InvestmentType,
  PERSONAL_SAVING_TYPE,
} from "../../constants";
import Alert from "@mui/material/Alert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addSavings,
  deleteSavings,
  updateSavings,
} from "../../services/savings";

interface SavingsFormProps {
  onClose: () => void;
  selectedAccount: SavingFormDataType | null;
}

export type SavingFormDataType = SavingAccountPayload & {
  id?: number;
};

function SavingsForm({ onClose, selectedAccount }: SavingsFormProps) {
  const initialFormData: SavingFormDataType = {
    name: "",
    balance: 0,
    owner: "",
    targetAmt: 0,
    accountType: PERSONAL_SAVING_TYPE,
    investmentType: InvestmentType.TFSA,
    contributionLimit: null,
  };
  const [formData, setFormData] = useState<SavingFormDataType>(
    selectedAccount ?? initialFormData
  );
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addSavings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
      queryClient.refetchQueries({ queryKey: ["wallets"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: SavingAccountPayload;
    }) => updateSavings(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savings"] });
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
      investmentType,
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
    <Stack spacing={4} sx={{ height: "100%" }}>
      <Typography variant="h3">
        {selectedAccount ? "Edit" : "Add"} saving account
      </Typography>
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
          <MenuItem value={PERSONAL_SAVING_TYPE}>Personal</MenuItem>;
          <MenuItem value={INVESTMENT_SAVING_TYPE}>Investment</MenuItem>;
        </SelectInputField>
        {formData.accountType === INVESTMENT_SAVING_TYPE && (
          <>
            <SelectInputField
              label="Investment Type"
              name="investmentType"
              value={formData.investmentType ?? undefined}
              onChange={handleFormSelectChange}
            >
              {Object.entries(INVESTMENT_TYPE).map(([key, value]) => {
                console.log({ key, value });
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
  );
}

export default SavingsForm;

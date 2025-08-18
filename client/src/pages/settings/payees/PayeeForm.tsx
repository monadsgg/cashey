import { useState } from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextInputField from "../../../components/TextInputField";
import { usePayees } from "../../../hooks/payees/usePayees";
import { useUpdatePayee } from "../../../hooks/payees/useUpdatePayee";

interface PayeeFormProps {
  selectedItem: PayeeFormData | null;
  onClose: () => void;
}

export interface PayeeFormData {
  id?: number;
  name: string;
}

function PayeeForm({ onClose, selectedItem }: PayeeFormProps) {
  const initialFormData: PayeeFormData = { name: "" };
  const [formData, setFormData] = useState<PayeeFormData>(
    selectedItem ?? initialFormData
  );
  const [error, setError] = useState("");
  const { payees } = usePayees();
  const updateMutation = useUpdatePayee();

  const handleSubmit = () => {
    const { name } = formData;

    const existingPayees = payees
      .filter((c) => !selectedItem || c.id !== selectedItem.id)
      .map((c) => c.name.toLowerCase());

    if (existingPayees.includes(name.toLowerCase())) {
      setError("Payee already exists.");
      return;
    }

    const payload = {
      name,
    };

    if (formData?.id) {
      updateMutation.mutate({ id: formData.id, payload });
    }

    setFormData({ ...formData, name: "" });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  return (
    <>
      <DialogContent>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <TextInputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {error && (
              <Stack>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "flex-end" }}
          >
            <Button variant="outlined" onClick={onClose} color="primary">
              Close
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.name || !!error}
            >
              Save Payee
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
}

export default PayeeForm;

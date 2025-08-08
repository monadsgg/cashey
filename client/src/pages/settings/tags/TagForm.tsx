import { useState } from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextInputField from "../../../components/TextInputField";
import { useTags } from "../../../hooks/tags/useTags";
import { useAddTag } from "../../../hooks/tags/useAddTag";
import { useUpdateTag } from "../../../hooks/tags/useUpdateTag";

interface TagFormProps {
  selectedItem: TagFormData | null;
  onClose: () => void;
}

export interface TagFormData {
  id?: number;
  name: string;
  color: string;
}

function TagForm({ onClose, selectedItem }: TagFormProps) {
  const initialFormData: TagFormData = {
    name: "",
    color: "#66CDAA",
  };
  const [formData, setFormData] = useState<TagFormData>(
    selectedItem ?? initialFormData
  );
  const [error, setError] = useState("");
  const { tags } = useTags();
  const addMutation = useAddTag();
  const updateMutation = useUpdateTag();

  const handleSubmit = () => {
    const { name, color } = formData;

    const existingTags = tags
      .filter((c) => !selectedItem || c.id !== selectedItem.id)
      .map((c) => c.name.toLowerCase());

    if (existingTags.includes(name.toLowerCase())) {
      setError("Tag already exists.");
      return;
    }

    const payload = {
      name,
      color,
    };

    if (formData?.id) {
      updateMutation.mutate({ id: formData.id, payload });
    } else {
      addMutation.mutate(payload);
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
            <TextInputField
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              type="color"
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
              {!selectedItem ? "Add " : "Save "}
              Tag
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </>
  );
}

export default TagForm;

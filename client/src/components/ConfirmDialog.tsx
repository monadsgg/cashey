import Typography from "@mui/material/Typography";
import FormDialog from "./FormDialog";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";

interface ConfirmDialogProps {
  onClose: () => void;
  onClickDelete: () => void;
  open: boolean;
  title: string;
}

function ConfirmDialog({
  onClose,
  onClickDelete,
  open,
  title,
}: ConfirmDialogProps) {
  return (
    <FormDialog title={`Delete ${title}`} open={open} onClose={onClose}>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Typography variant="body1">
          Are you sure you want to delete this {title}? This action cannot be
          undone.
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            // size="small"
            color="error"
            variant="contained"
            onClick={onClickDelete}
          >
            Delete
          </Button>
        </Stack>
      </DialogContent>
    </FormDialog>
  );
}

export default ConfirmDialog;

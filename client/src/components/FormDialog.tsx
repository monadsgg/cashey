import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import type { SxProps } from "@mui/material/styles";

interface FormDialogProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
  title: string;
  paperSx?: SxProps;
}

function FormDialog({
  onClose,
  open,
  children,
  title,
  paperSx,
}: FormDialogProps) {
  return (
    <Dialog
      closeAfterTransition={false}
      onClose={onClose}
      open={open}
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            width: "25vw",
            borderRadius: "10px",
            p: "8px",
            minWidth: "500px",
            ...paperSx,
          },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  );
}

export default FormDialog;

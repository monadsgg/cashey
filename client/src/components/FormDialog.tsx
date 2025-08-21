import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

interface FormDialogProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
  title: string;
}

function FormDialog({ onClose, open, children, title }: FormDialogProps) {
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

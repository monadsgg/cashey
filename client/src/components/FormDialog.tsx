import Dialog from "@mui/material/Dialog";

interface FormDialogProps {
  onClose: () => void;
  open: boolean;
  children: React.ReactNode;
}

function FormDialog({ onClose, open, children }: FormDialogProps) {
  return (
    <Dialog
      closeAfterTransition={false}
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            position: "fixed",
            top: 0,
            right: 0,
            height: "100vh",
            width: "25vw",
            m: 0,
            borderRadius: 0,
            maxHeight: "100%",
            p: "40px",
          },
        },
      }}
    >
      {children}
    </Dialog>
  );
}

export default FormDialog;

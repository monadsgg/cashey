import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
  severity?: "success" | "error";
}

function Toast({ message, open, onClose, severity = "success" }: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;

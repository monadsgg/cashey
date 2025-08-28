import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

interface ToastProps {
  message: string;
  open: boolean;
  onClose: () => void;
}

function Toast({ message, open, onClose }: ToastProps) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
    >
      <Alert
        onClose={onClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Toast;

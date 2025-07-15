import { useState } from "react";
import Button from "@mui/material/Button";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import FormDialog from "./FormDialog";
import TransferMoneyForm from "./TransferMoneyForm";

interface TransferMoneyButtonProps {
  label: string;
  isSavings?: boolean;
}

function TransferMoneyButton({ label, isSavings }: TransferMoneyButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Stack sx={{ p: "10px 0" }}>
        <Button
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "12px",
            border: "2px dashed",
          }}
          color="secondary"
          variant="outlined"
          size="large"
          startIcon={<PaidIcon fontSize="large" />}
          onClick={handleClick}
        >
          {label}
        </Button>
      </Stack>
      <FormDialog open={open} onClose={handleClose}>
        <TransferMoneyForm onClose={handleClose} isSavings={isSavings} />
      </FormDialog>
    </>
  );
}

export default TransferMoneyButton;

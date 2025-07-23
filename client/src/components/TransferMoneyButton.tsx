import { useState } from "react";
import Button from "@mui/material/Button";
import PaidIcon from "@mui/icons-material/Paid";
import Stack from "@mui/material/Stack";
import FormDialog from "./FormDialog";
import TransferMoneyForm from "./TransferMoneyForm";
import { useWallets } from "../hooks/useWallets";
import CircularProgress from "@mui/material/CircularProgress";

interface TransferMoneyButtonProps {
  label: string;
  isAccounts?: boolean;
}

function TransferMoneyButton({ label, isAccounts }: TransferMoneyButtonProps) {
  const [open, setOpen] = useState(false);
  const { accountWallets, isLoading } = useWallets();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  if (isLoading) return <CircularProgress />;

  const disabled = accountWallets.length === 0;

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
          disabled={disabled}
        >
          {label}
        </Button>
      </Stack>
      <FormDialog open={open} onClose={handleClose}>
        <TransferMoneyForm onClose={handleClose} isAccounts={isAccounts} />
      </FormDialog>
    </>
  );
}

export default TransferMoneyButton;

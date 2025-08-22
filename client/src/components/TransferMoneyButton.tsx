import { useState } from "react";
import Button from "@mui/material/Button";
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
      <Button variant="outlined" onClick={handleClick} disabled={disabled}>
        {label}
      </Button>
      <FormDialog title="Transfer Funds" open={open} onClose={handleClose}>
        <TransferMoneyForm onClose={handleClose} isAccounts={isAccounts} />
      </FormDialog>
    </>
  );
}

export default TransferMoneyButton;

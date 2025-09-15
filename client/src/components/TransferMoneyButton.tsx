import { useState } from "react";
import FormDialog from "./FormDialog";
import TransferMoneyForm from "./TransferMoneyForm";
import { useWallets } from "../hooks/wallets/useWallets";
import CircularProgress from "@mui/material/CircularProgress";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface TransferMoneyButtonProps {
  isAccounts?: boolean;
}

function TransferMoneyButton({ isAccounts }: TransferMoneyButtonProps) {
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
      <Tooltip title="Transfer funds">
        <IconButton
          aria-label="transfer button"
          color="primary"
          sx={{
            border: "1px solid",
            borderColor: "primary",
            borderRadius: "6px",
            p: "0 10px",
          }}
          disabled={disabled}
          onClick={handleClick}
        >
          <CurrencyExchangeIcon />
        </IconButton>
      </Tooltip>
      <FormDialog title="Transfer Funds" open={open} onClose={handleClose}>
        <TransferMoneyForm onClose={handleClose} isAccounts={isAccounts} />
      </FormDialog>
    </>
  );
}

export default TransferMoneyButton;

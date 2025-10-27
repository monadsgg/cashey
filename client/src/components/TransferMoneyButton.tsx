import { Suspense, useState } from "react";
import FormDialog from "./FormDialog";
import TransferMoneyForm from "./TransferMoneyForm";
import { useWallets } from "../hooks/wallets/useWallets";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ErrorMessage from "./ErrorMessage";
import Loading from "./Loading";

interface TransferMoneyButtonProps {
  isAccounts?: boolean;
}

function TransferMoneyButton({ isAccounts }: TransferMoneyButtonProps) {
  const [open, setOpen] = useState(false);
  const { mainWallet, accountWallets } = useWallets();

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpen(true);
  };

  if (!mainWallet) return <ErrorMessage message="Main wallet is not found" />;
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
      <Suspense fallback={<Loading />}>
        <FormDialog title="Transfer Funds" open={open} onClose={handleClose}>
          <TransferMoneyForm
            isAccounts={isAccounts}
            mainWallet={mainWallet}
            accountWallets={accountWallets}
            onClose={handleClose}
          />
        </FormDialog>
      </Suspense>
    </>
  );
}

export default TransferMoneyButton;

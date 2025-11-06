import { Suspense, useState } from "react";
import FormDialog from "./FormDialog";
import TransferMoneyForm from "./TransferMoneyForm";
import { useWallets } from "../hooks/wallets/useWallets";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Loading from "./Loading";
import type { Wallet } from "../services/wallet";

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
          disabled={accountWallets.length === 0}
          onClick={handleClick}
        >
          <CurrencyExchangeIcon />
        </IconButton>
      </Tooltip>
      <Suspense fallback={<Loading />}>
        <FormDialog title="Transfer Funds" open={open} onClose={handleClose}>
          <TransferMoneyForm
            isAccounts={isAccounts}
            mainWallet={mainWallet as Wallet}
            accountWallets={accountWallets}
            onClose={handleClose}
          />
        </FormDialog>
      </Suspense>
    </>
  );
}

export default TransferMoneyButton;

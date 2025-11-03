import { useState } from "react";
import { useUpdateWallet } from "../../hooks/wallets/useUpdateWallet";
import { useWallets } from "../../hooks/wallets/useWallets";
import { formatCurrency } from "../../utils/currency";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import { WalletSchema } from "../../schemas/walletSchema";
import { getZodIssueObj } from "../../utils/validators";

type ErrorMsg = { name?: string; balance?: string };

type WalletFormData = { name: string; balance: number };

function MainWalletBox() {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<ErrorMsg>({});
  const [walletData, setWalletData] = useState<WalletFormData>({
    name: "Main Wallet Balance",
    balance: 0,
  });

  const { mainWallet, isLoading } = useWallets();
  const updateMainWallet = useUpdateWallet();

  const handleEditBtnClick = () => {
    if (!mainWallet) return;

    setEditing(true);
    setWalletData({ name: mainWallet.name, balance: mainWallet.balance });
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
  };

  const handleUpdate = async () => {
    if (!mainWallet) return;

    const { name, balance } = walletData;

    // validate with zod
    const result = WalletSchema.safeParse({ name, balance });

    if (result.success) {
      const resultWallet = await updateMainWallet.mutateAsync({
        id: mainWallet.id,
        payload: { name, balance: Number(balance) },
      });

      setWalletData({ name: resultWallet.name, balance: resultWallet.balance });
      setEditing(false);
    } else {
      result.error.issues.forEach((issue) => {
        const newError = getZodIssueObj(issue);
        setErrors({ ...errors, ...newError });
      });
    }
  };

  const renderContent = () => {
    if (isLoading) return <CircularProgress />;

    return (
      <>
        <Typography variant="subtitle1">{mainWallet?.name}</Typography>
        <Typography variant="h4">
          {formatCurrency(mainWallet?.balance || 0)}
        </Typography>
        <IconButton
          size="small"
          onClick={handleEditBtnClick}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
          aria-label="edit main balance"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </>
    );
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setWalletData({ ...walletData, [name]: value });
    setErrors({});
  };

  const renderForm = () => {
    return (
      <>
        <TextField
          size="small"
          name="name"
          value={walletData.name}
          onChange={handleOnChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          size="small"
          name="balance"
          value={walletData.balance}
          onChange={handleOnChange}
          error={!!errors.balance}
          helperText={errors.balance}
        />
        <Stack direction="row">
          <Button
            size="small"
            onClick={handleUpdate}
            variant="text"
            startIcon={<DoneIcon />}
          >
            Update
          </Button>
          <Button
            size="small"
            onClick={handleCancel}
            variant="text"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
        </Stack>
      </>
    );
  };

  return (
    <Stack
      spacing={1}
      sx={{
        border: "1px solid #ccc",
        p: 4,
        borderRadius: 4,
        alignItems: "center",
        position: "relative",
      }}
    >
      {!editing ? renderContent() : renderForm()}
    </Stack>
  );
}

export default MainWalletBox;

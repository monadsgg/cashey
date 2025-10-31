import { useEffect, useState } from "react";
import { z, ZodError } from "zod";
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

const WalletSchema = z.object({
  name: z.string().min(1, "Wallet Name is required"),
  balance: z
    .string()
    .min(1, "Balance is required") // keep as string for form input
    .refine((val) => !isNaN(Number(val)), {
      message: "Balance must be a number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Balance must be a positive number",
    }),
});

type ErrorMsg = { name?: string; balance?: string };

type WalletFormData = { name: string; balance: number };

function MainWalletBox() {
  const { mainWallet, isLoading } = useWallets();
  const updateMainWallet = useUpdateWallet();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorMsg>({});
  const [walletData, setWalletData] = useState<WalletFormData>({
    name: "Main Wallet Balance",
    balance: 0,
  });

  useEffect(() => {
    if (mainWallet) {
      setWalletData({ name: mainWallet.name, balance: mainWallet.balance });
    }
  }, [mainWallet]);

  const handleEditBtnClick = () => {
    setEditing(true);

    if (mainWallet) {
      setWalletData({ name: mainWallet.name, balance: mainWallet.balance });
    }
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

    if (result.error instanceof ZodError) {
      const errors: ErrorMsg = {};

      result.error.issues.forEach((err) => {
        if (err.path[0] === "name") errors.name = err.message;
        if (err.path[0] === "balance") errors.balance = err.message;
      });

      setErrors(errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const resultWallet = await updateMainWallet.mutateAsync({
        id: mainWallet.id,
        payload: { name, balance: Number(balance) },
      });

      setWalletData({ name: resultWallet.name, balance: resultWallet.balance });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <CircularProgress />;

  const renderContent = () => {
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
            disabled={loading}
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

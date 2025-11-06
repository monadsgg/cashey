import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getAmountSign } from "../../utils/currency";
import Box from "@mui/material/Box";
import type { AccountTransaction } from "../../services/accounts";

interface TransactionGroupProps {
  date: string;
  items: AccountTransaction[];
}

function TransactionGroup({ date, items }: TransactionGroupProps) {
  return (
    <Stack spacing={1}>
      <Typography color="secondary" variant="subtitle1">
        {date}
      </Typography>
      {items.map((t: AccountTransaction) => (
        <Box
          key={t.id}
          sx={(theme) => ({
            padding: 2,
            border: `1px dashed ${theme.palette.secondary.main}`,
            borderRadius: 2,
          })}
        >
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="subtitle2">{t.description}</Typography>
            <Typography variant="subtitle2">
              {getAmountSign(t.category.type)}
              {t.amount}
            </Typography>
          </Stack>
          <Typography sx={{ opacity: 0.7 }} variant="subtitle2">
            {t.wallet.name}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

export default TransactionGroup;

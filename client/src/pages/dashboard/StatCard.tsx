import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import type { IconType } from "../../types";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../../utils/currencyUtils";

interface StatCard {
  title: string;
  Icon: IconType;
  color: string;
  amount: number;
  caption: string;
}

function StatCard({ title, Icon, color, amount, caption }: StatCard) {
  return (
    <Card elevation={1} sx={{ p: 3 }}>
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Typography>{title}</Typography>
        <Icon fontSize="large" sx={{ color: `${color}` }} />
      </Stack>
      <Stack mt={2}>
        <Typography color={color} variant="h3">
          {formatCurrency(amount)}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
          {caption}
        </Typography>
      </Stack>
    </Card>
  );
}

export default StatCard;

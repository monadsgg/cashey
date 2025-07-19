import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatCurrency } from "../utils/currencyUtils";

export interface SummaryListItemProps {
  title: string;
  amount: number;
  textColor?: string;
}

function SummaryListItem({
  title,
  amount,
  textColor = "secondary",
}: SummaryListItemProps) {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <Typography color={textColor} sx={{ fontWeight: 500, fontSize: "18px" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "18px" }}>
        {formatCurrency(amount)}
      </Typography>
    </Stack>
  );
}

export default SummaryListItem;

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import FaceIcon from "@mui/icons-material/Face";
import ProgressBar from "../../components/ProgressBar";
import { INVESTMENT_SAVING_TYPE } from "../../constants";
import { formatCurrency } from "../../utils/currencyUtils";

interface SavingsCardProps {
  title: string;
  chipLabel: string;
  accountType?: string;
  currentAmt: number;
  targetAmt: number;
  remainingAmt: number;
  contributionLimit?: number;
  percentage: number;
}

const SavingsCard = ({
  title,
  chipLabel,
  accountType,
  currentAmt,
  targetAmt,
  remainingAmt,
  contributionLimit,
  percentage,
}: SavingsCardProps) => {
  let alertSeverity: "success" | "error" | "info";
  let alertMessage: string;

  if (percentage >= 100) {
    alertSeverity = "success";
    alertMessage = "You have reached 100% of your limit.";
  } else if (percentage >= 80) {
    alertSeverity = "error";
    alertMessage = "Only a little left to reach your goal!";
  } else {
    alertSeverity = "info";
    alertMessage = "You still have room to contribute!";
  }

  return (
    <Card>
      <Stack p={2} spacing={2}>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <Chip
            variant="outlined"
            icon={<FaceIcon />}
            label={chipLabel}
            color="secondary"
            sx={{ width: "100px", borderRadius: "6px" }}
          />
        </Stack>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2">
              Current: {formatCurrency(currentAmt)}
            </Typography>
            <Typography variant="subtitle2">
              {accountType === INVESTMENT_SAVING_TYPE &&
              contributionLimit &&
              targetAmt
                ? `Contribution Limit: ${formatCurrency(contributionLimit)}`
                : `Target: ${formatCurrency(targetAmt)}`}
            </Typography>
          </Stack>

          <ProgressBar value={percentage} />

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2">
              {accountType === INVESTMENT_SAVING_TYPE &&
              contributionLimit &&
              targetAmt
                ? `${percentage}% complete of annual limit ($${targetAmt})`
                : `${percentage}% complete`}
            </Typography>
            <Typography variant="subtitle2">
              {formatCurrency(remainingAmt)} Remaining
            </Typography>
          </Stack>
        </Stack>
        {accountType === INVESTMENT_SAVING_TYPE && (
          <Alert
            severity={alertSeverity}
            variant="outlined"
            sx={{ p: "0 16px" }}
          >
            {alertMessage}
          </Alert>
        )}
      </Stack>
    </Card>
  );
};

export default SavingsCard;

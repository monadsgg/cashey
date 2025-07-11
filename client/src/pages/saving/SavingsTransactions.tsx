import Stack from "@mui/material/Stack";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryTitle from "../../components/SummaryTitle";
import Chip from "@mui/material/Chip";

function SavingsTransactions() {
  return (
    <SummaryContainer>
      <SummaryTitle title="Monthly Transactions" />
      <Stack direction={"row"} spacing={2}>
        <Chip label="All" color="primary" variant="outlined" />
        <Chip label="Deposits" color="primary" />
        <Chip label="Withdrawals" color="primary" />
      </Stack>
    </SummaryContainer>
  );
}

export default SavingsTransactions;

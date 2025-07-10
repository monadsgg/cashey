import { useMemo } from "react";
import { useSavings } from "../../hooks/useSavings";
import Stack from "@mui/material/Stack";
import SummaryTitle from "../../components/SummaryTitle";
import SummaryListItem from "../../components/SummaryListItem";
import Divider from "@mui/material/Divider";
import SummaryContainer from "../../components/SummaryContainer";

function SavingsSummary() {
  const { savings, personalAccounts, investmentAccounts } = useSavings();

  const savingsSummary = useMemo(() => {
    const savings = { personal: 0, investments: 0, total: 0 };

    personalAccounts.forEach(
      (acc) => (savings.personal += Number(acc.balance))
    );
    investmentAccounts.forEach(
      (acc) => (savings.investments += Number(acc.balance))
    );

    const totalSavings = {
      ...savings,
      total: savings.investments + savings.personal,
    };

    return totalSavings;
  }, [savings]);

  const { personal, investments, total } = savingsSummary;

  return (
    <SummaryContainer>
      <SummaryTitle title="Savings Summary" />
      <Stack spacing={1}>
        <SummaryListItem title="Personal" amount={personal} />
        <SummaryListItem title="Investments" amount={investments} />
        <Divider />
        <SummaryListItem title="Total" amount={total} />
      </Stack>
    </SummaryContainer>
  );
}

export default SavingsSummary;

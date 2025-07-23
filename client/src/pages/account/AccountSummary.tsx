import { useMemo } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import Stack from "@mui/material/Stack";
import SummaryTitle from "../../components/SummaryTitle";
import SummaryListItem from "../../components/SummaryListItem";
import Divider from "@mui/material/Divider";
import SummaryContainer from "../../components/SummaryContainer";

function AccountSummary() {
  const { accounts, personalAccounts, investmentAccounts } = useAccounts();

  const accountSummary = useMemo(() => {
    const accountStat = { personal: 0, investments: 0, total: 0 };

    personalAccounts.forEach(
      (acc) => (accountStat.personal += Number(acc.balance))
    );
    investmentAccounts.forEach(
      (acc) => (accountStat.investments += Number(acc.balance))
    );

    const finalAccountStat = {
      ...accountStat,
      total: accountStat.investments + accountStat.personal,
    };

    return finalAccountStat;
  }, [accounts]);

  const { personal, investments, total } = accountSummary;

  return (
    <SummaryContainer>
      <SummaryTitle title="Accounts Summary" />
      <Stack spacing={1}>
        <SummaryListItem title="Personal" amount={personal} />
        <SummaryListItem title="Investments" amount={investments} />
        <Divider />
        <SummaryListItem title="Total" amount={total} />
      </Stack>
    </SummaryContainer>
  );
}

export default AccountSummary;

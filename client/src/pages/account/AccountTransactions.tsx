import { useMemo, useState } from "react";
import groupBy from "lodash/groupBy";
import styled from "@mui/system/styled";
import Stack from "@mui/material/Stack";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryTitle from "../../components/SummaryTitle";
import { format, lastDayOfMonth, startOfMonth } from "date-fns";
import { AccountTransactionType } from "../../constants";
import type { DateRange } from "../transaction/Transaction";
import type { AccountTransaction } from "../../services/accounts";
import { useAccountTransactions } from "../../hooks/accounts/useAccountTransactions";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import TransactionGroup from "./TransactionGroup";
import TransactionTabs from "./TransactionTabs";

const ScrollableContainer = styled("div")(() => ({
  height: "52vh",
  overflowY: "hidden",
  [`&:hover`]: {
    overflowY: "auto",
  },
}));

function AccountTransactions() {
  const dateRange: DateRange = {
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(lastDayOfMonth(new Date()), "yyyy-MM-dd"),
  };
  const [selectedTab, setSelectedTab] = useState(AccountTransactionType.ALL);

  const { transactions, isLoading } = useAccountTransactions(dateRange);

  const selectedTransactions: AccountTransaction[] =
    transactions?.[selectedTab] || [];

  const dataGroupedByDate = useMemo(
    () =>
      groupBy(
        selectedTransactions,
        (t) => new Date(t.date).toISOString().split("T")[0]
      ),
    [selectedTransactions]
  );

  const handleTabClick = (type: string) => {
    setSelectedTab(type);
  };

  const renderTransactionList = () => {
    if (isLoading) return <Loading message="Loading transactions..." />;

    if (!selectedTransactions.length)
      return <EmptyState message="No transaction to display" />;

    return (
      <Stack spacing={2}>
        {Object.entries(dataGroupedByDate).map(([date, items]) => (
          <TransactionGroup key={date} date={date} items={items} />
        ))}
      </Stack>
    );
  };

  return (
    <SummaryContainer>
      <SummaryTitle title="Monthly Transactions" />
      <Stack direction={"row"} spacing={2}>
        <TransactionTabs selectedTab={selectedTab} onClick={handleTabClick} />
      </Stack>
      <ScrollableContainer>{renderTransactionList()}</ScrollableContainer>
    </SummaryContainer>
  );
}

export default AccountTransactions;

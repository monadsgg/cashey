import { useMemo, useState } from "react";
import { useSavingsTransactions } from "../../hooks/useSavingsTransactions";
import Stack from "@mui/material/Stack";
import SummaryContainer from "../../components/SummaryContainer";
import SummaryTitle from "../../components/SummaryTitle";
import Chip from "@mui/material/Chip";
import { SavingTransactionType } from "../../constants";
import { transferCategory } from "../app/appConstants";
import groupBy from "lodash/groupBy";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { getAmountSign } from "../../utils/currencyUtils";
import { format, lastDayOfMonth, startOfMonth } from "date-fns";
import styled from "@mui/system/styled";
import Box from "@mui/material/Box";

type SavingTransaction = {
  id: number;
  amount: number;
  date: Date;
  description: string;
  wallet: { id: number; name: string };
  category: Category;
};

const ScrollableContainer = styled("div")(() => ({
  height: "45vh",
  overflowY: "hidden",
  [`&:hover`]: {
    overflowY: "auto",
  },
}));

interface TransactionTabsProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TransactionTabs({ label, isActive, onClick }: TransactionTabsProps) {
  return (
    <Chip
      label={label}
      color="primary"
      variant={isActive ? "filled" : "outlined"}
      onClick={onClick}
    />
  );
}

function SavingsTransactions() {
  const dateRange: DateRange = {
    startDate: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    endDate: format(lastDayOfMonth(new Date()), "yyyy-MM-dd"),
  };

  const { transactions, isLoading } = useSavingsTransactions(dateRange);
  const [transactionType, setTransactionType] = useState(
    SavingTransactionType.ALL
  );

  const filteredData = useMemo(() => {
    return transactions.filter((t: SavingTransaction) => {
      if (transactionType === SavingTransactionType.DEPOSIT) {
        return t.category.id === transferCategory.INCOMING_TRANSFER;
      }
      if (transactionType === SavingTransactionType.WITHDRAWAL) {
        return t.category.id === transferCategory.OUTGOING_TRANSFER;
      }
      return true;
    });
  }, [transactions, transactionType]);

  const dataGroupedByDate = useMemo(() => {
    return groupBy(
      filteredData,
      (t) => new Date(t.date).toISOString().split("T")[0]
    );
  }, [filteredData]);

  const handleTabClick = (type: string) => {
    setTransactionType(type);
  };

  return (
    <SummaryContainer>
      <SummaryTitle title="Monthly Transactions" />
      <Stack direction={"row"} spacing={2}>
        <TransactionTabs
          label="All"
          isActive={transactionType === SavingTransactionType.ALL}
          onClick={() => handleTabClick(SavingTransactionType.ALL)}
        />
        <TransactionTabs
          label="Deposit"
          isActive={transactionType === SavingTransactionType.DEPOSIT}
          onClick={() => handleTabClick(SavingTransactionType.DEPOSIT)}
        />
        <TransactionTabs
          label="Withdrawal"
          isActive={transactionType === SavingTransactionType.WITHDRAWAL}
          onClick={() => handleTabClick(SavingTransactionType.WITHDRAWAL)}
        />
      </Stack>
      <ScrollableContainer>
        <Stack spacing={2}>
          {isLoading && (
            <Stack alignItems="center" mt={4}>
              <CircularProgress />
              <Typography mt={2}>Loading transactions...</Typography>
            </Stack>
          )}

          {!isLoading && filteredData.length === 0 && (
            <Typography mt={4}>No transactions to display.</Typography>
          )}

          {!isLoading &&
            Object.entries(dataGroupedByDate).map(([date, items]) => (
              <Stack key={date} spacing={1}>
                <Typography color="secondary" variant="subtitle1">
                  {date}
                </Typography>
                {items.map((t: SavingTransaction) => (
                  <Box
                    key={t.id}
                    sx={(theme) => ({
                      padding: 2,
                      border: `1px dashed ${theme.palette.secondary.main}`,
                      borderRadius: 2,
                    })}
                  >
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2">
                        {t.description}
                      </Typography>
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
            ))}
        </Stack>
      </ScrollableContainer>
    </SummaryContainer>
  );
}

export default SavingsTransactions;

import { AccountTransactionType } from "../../constants";
import Chip from "@mui/material/Chip";

interface TransactionTabsProps {
  selectedTab: string;
  onClick: (type: string) => void;
}

const TRANSACTION_TABS = [
  { label: "All", type: AccountTransactionType.ALL },
  { label: "Deposit", type: AccountTransactionType.DEPOSIT },
  { label: "Withdrawal", type: AccountTransactionType.WITHDRAWAL },
] as const;

function TransactionTabs({ selectedTab, onClick }: TransactionTabsProps) {
  return TRANSACTION_TABS.map((t) => (
    <Chip
      label={t.label}
      color="primary"
      variant={selectedTab === t.type ? "filled" : "outlined"}
      onClick={() => onClick(t.type)}
    />
  ));
}

export default TransactionTabs;

import { SvgIconProps } from "@mui/material/SvgIcon";

type TransactionItem = {
  id: number;
  category: Category;
  amount: number;
  date: string;
  description: string;
  tag?: Tag;
  payee?: Payee;
};

type TransactionPayload = {
  categoryId: number;
  amount: number;
  date: string;
  description: string;
  tagId?: number | null;
  payeeId?: number | null;
  walletId: number;
};

type TransferPayload = {
  date: string;
  fromWalletId: number;
  toWalletId: number;
  amount: number;
  description: string;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

type TransactionTableSettingsType = {
  tag: boolean;
  payee: boolean;
};

type Category = {
  id: number;
  name: string;
  type: string;
};

type Tag = {
  id: number;
  name: string;
};

type Payee = {
  id: number;
  name: string;
};

type Wallet = {
  id: number;
  name: string;
  type: string;
  balance: number;
};

type SavingAccount = {
  id: number;
  name: string;
  balance: number;
  type: string;
  savingAccount: SavingAccountDetails;
};

type SavingAccountDetails = {
  walletId: number;
  accountType: string;
  owner: string;
  targetAmt: number;
  investmentType?: string;
  contributionLimit?: number;
};

type SavingAccountPayload = {
  name: string;
  balance: number;
  owner: string;
  targetAmt: number;
  accountType: string;
  investmentType?: string | null;
  contributionLimit?: number | null;
};

type IconType = React.ComponentType<SvgIconProps>;

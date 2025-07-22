import { SvgIconProps } from "@mui/material/SvgIcon";

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

import { CategoryType } from './enums';

type BalanceAdjustmentParams = {
  balance: number;
  amount: number;
  type: string;
  isRefund: boolean | undefined;
  reverse?: boolean;
};

function adjustBalance({
  balance,
  amount,
  type,
  isRefund,
  reverse = false,
}: BalanceAdjustmentParams): number {
  const multiplier = reverse ? -1 : 1;

  if (isRefund) {
    balance += amount * multiplier;
  } else {
    if (type === CategoryType.INCOME) {
      balance += amount * multiplier;
    } else if (type === CategoryType.EXPENSE) {
      balance -= amount * multiplier;
    }
  }

  return balance;
}

export default adjustBalance;

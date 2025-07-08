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

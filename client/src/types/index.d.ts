type TransactionItem = {
  id?: number;
  category: Category;
  amount: number;
  date: Date;
  description: string;
  tag?: Tag;
  payee?: Payee;
};

type Category = {
  id?: number;
  name: string;
  type: "expense" | "income";
};

type Tag = {
  id?: number;
  name: string;
};

type Payee = {
  id?: number;
  name: string;
};

type DateRange = {
  startDate: string;
  endDate: string;
};

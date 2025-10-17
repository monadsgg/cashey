export enum WalletType {
  MAIN = 'main',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum SavingType {
  PERSONAL = 'personal',
  INVESTMENT = 'investment',
}

export enum InvestmentAccountType {
  TFSA = 'Tax-Free Savings Account (TFSA)',
  RRSP = 'Registered Retirement Savings Plan (RRSP)',
  FHSA = 'First Home Savings Account (FHSA)',
}

export enum FilterRuleType {
  CONTAINS = 'contains',
  EXACT = 'exact',
  IS = 'is',
  IS_NOT = 'is_not',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
}

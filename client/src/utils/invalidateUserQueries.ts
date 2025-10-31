// utils/invalidateUserQueries.ts
import { QueryClient } from "@tanstack/react-query";

export function invalidateUserQueries(queryClient: QueryClient) {
  const userQueries = [
    "transactions",
    "all-transactions",
    "wallets",
    "accounts",
    "accounts-transactions",
    "statsOverview",
    "spendingCategory",
    "payees",
    "tags",
    "categories",
    "user-categories",
    "budgets",
  ];

  userQueries.forEach((key: string) => {
    queryClient.removeQueries({ queryKey: [key], exact: false });
  });
}

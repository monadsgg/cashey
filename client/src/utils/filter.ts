import { FilterRuleType } from "../constants";

export const FILTER_GROUPS = {
  field: {
    label: "BY FIELD",
    options: [
      { value: "payee", label: "Payee" },
      { value: "category", label: "Category" },
      { value: "tag", label: "Tag" },
    ],
  },
  amount: {
    label: "BY AMOUNT",
    options: [
      { value: "income", label: "Income" },
      { value: "expense", label: "Expense" },
    ],
  },
};

export const RULE_OPERATORS: Record<
  string,
  { value: string; label: string }[]
> = {
  search: [{ value: FilterRuleType.contains, label: "contains" }],
  payee: [
    { value: FilterRuleType.contains, label: "contains" },
    { value: FilterRuleType.exact, label: "matches exactly" },
  ],
  category: [
    { value: FilterRuleType.is, label: "is" },
    { value: FilterRuleType.isNot, label: "is not" },
  ],
  tag: [
    { value: FilterRuleType.is, label: "is" },
    { value: FilterRuleType.isNot, label: "is not" },
  ],
  income: [
    { value: FilterRuleType.exact, label: "exactly" },
    { value: FilterRuleType.greaterThan, label: "greater than" },
    { value: FilterRuleType.lessThan, label: "less than" },
  ],
  expense: [
    { value: FilterRuleType.exact, label: "exactly" },
    { value: FilterRuleType.greaterThan, label: "greater than" },
    { value: FilterRuleType.lessThan, label: "less than" },
  ],
};

export function getDefaultRuleForType(type: string) {
  const ops = RULE_OPERATORS[type];
  if (ops && ops.length > 0) return ops[0].value;
  return "contains";
}

export function getFilterLabel(val: string | undefined) {
  if (!val) return "";
  if (val === "search") return "General search";

  for (const [, group] of Object.entries(FILTER_GROUPS)) {
    const found = group.options.find((o) => o.value === val);
    if (found) return found.label;
  }

  return String(val);
}

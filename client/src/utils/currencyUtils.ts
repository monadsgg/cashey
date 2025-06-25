export function formatCurrency(
  amount: number,
  currency: string = "CAD",
  locale: string = "en-CA"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

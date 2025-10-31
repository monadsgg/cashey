export function getAccountProgress(balance: number, targetAmount: number) {
  const percentage = Math.ceil((balance / targetAmount) * 100);
  const remaining = targetAmount - balance;

  return { percentage, remaining };
}

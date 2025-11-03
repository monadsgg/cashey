import z from "zod";

export const WalletSchema = z.object({
  name: z.string().min(1, "Wallet Name is required"),
  balance: z
    .string()
    .min(1, "Balance is required") // keep as string for form input
    .refine((val) => !isNaN(Number(val)), {
      message: "Balance must be a number",
    })
    .refine((val) => Number(val) >= 0, {
      message: "Balance must be a positive number",
    }),
});

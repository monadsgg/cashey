import z from "zod";

const PayeeSchema = z.object({
  id: z.int(),
  name: z.string(),
});

const TagSchema = z.object({
  id: z.int(),
  name: z.string(),
  color: z.string(),
});

const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
export const TransactionFormSchema = z.object({
  id: z.int().optional(),
  description: z.string(),
  date: z.date(),
  categoryId: z.int(),
  amount: z.string().refine((val) => amountRegex.test(val), {
    error: "Amount must be a valid number",
  }),
  payee: PayeeSchema.nullable(),
  tags: z.array(TagSchema),
  isRefund: z.boolean(),
});

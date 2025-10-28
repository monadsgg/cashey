import z from "zod";

const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const amountSchema = z.string().refine((val) => amountRegex.test(val), {
  error: "Amount must be a valid number",
});

export const AccountFormSchema = z.object({
  id: z.int().optional(),
  name: z.string().min(1, { error: "Name is required" }),
  balance: amountSchema,
  owner: z.string().min(1, { error: "Owner is required" }),
  targetAmt: amountSchema.refine((val) => parseFloat(val) > 0, {
    error: "Amount must be greater than 0",
  }),
  accountType: z.string(),
  investmentType: z.string().nullable(),
  contributionLimit: z.string().nullable(),
});

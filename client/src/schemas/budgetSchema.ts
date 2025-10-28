import z from "zod";

const amountRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const amountLimitSchema = z.string().superRefine((val, ctx) => {
  if (!amountRegex.test(val)) {
    ctx.addIssue({
      code: "custom",
      message: "Amount must be a valid number",
    });
    return;
  }
  if (parseFloat(val) <= 0) {
    ctx.addIssue({
      code: "custom",
      message: "Amount must be greater than 0",
    });
    return;
  }
});

export const BudgetFormSchema = z.object({
  id: z.int().optional(),
  categoryId: z.int(),
  amountLimit: amountLimitSchema,
  month: z.int(),
  year: z.int(),
});

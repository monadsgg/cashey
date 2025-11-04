import { z } from "zod";

const emailSchema = z.email();
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const UserLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const UserRegisterSchema = z.object({
  name: z.string().min(2, "Password must be at least 2 characters long"),
  email: emailSchema,
  password: passwordSchema,
});

import z from "zod";

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function getZodIssueObj(issue: z.core.$ZodIssue) {
  return { [issue.path[0]]: issue.message };
}

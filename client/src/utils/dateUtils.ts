import { format } from "date-fns";

export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr);
};

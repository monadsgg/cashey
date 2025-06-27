import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import { toZonedTime, format } from "date-fns-tz";

const getZonedDate = (date: string | Date) => {
  return toZonedTime(date, "UTC");
};

export const formatDate = (dateStr: string | Date, formatStr: string) => {
  return format(getZonedDate(dateStr), formatStr);
};

export const getFirstDayOfPrevMonth = (dateStr: string) => {
  const date = getZonedDate(dateStr);
  return format(startOfMonth(subMonths(date, 1)), "yyyy-MM-dd");
};

export const getLastDayOfPrevMonth = (dateStr: string) => {
  const date = getZonedDate(dateStr);
  return format(endOfMonth(subMonths(date, 1)), "yyyy-MM-dd");
};

export const getFirstDayOfNextMonth = (dateStr: string) => {
  const date = getZonedDate(dateStr);
  return format(startOfMonth(addMonths(date, 1)), "yyyy-MM-dd");
};

export const getLastDayOfNextMonth = (dateStr: string) => {
  const date = getZonedDate(dateStr);
  return format(endOfMonth(addMonths(date, 1)), "yyyy-MM-dd");
};

export const getCurrentMonth = (dateStr: string) => {
  return format(getZonedDate(dateStr), "MMMM");
};

export const getCurrentYear = (dateStr: string) => {
  return format(getZonedDate(dateStr), "yyyy");
};

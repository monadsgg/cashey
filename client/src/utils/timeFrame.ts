import {
  format,
  subMonths,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

export type TimeframeKey =
  | "lastMonth"
  | "last2Months"
  | "thisYear"
  | "lastYear"
  | "allTime"
  | "custom";

export type TimeframeOption = {
  value: TimeframeKey;
  label: string;
  from?: string;
  to?: string;
};

const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

// cache key by current year-month so options recompute when month changes
let _cache: { key: string; options: TimeframeOption[] } | null = null;

export function getTimeframeOptions(now = new Date()): TimeframeOption[] {
  const cacheKey = format(now, "yyyy-MM");
  if (_cache && _cache.key === cacheKey) return _cache.options;

  const lastMonthDate = subMonths(now, 1);
  const twoMonthsAgoDate = subMonths(now, 2);
  const lastYearDate = subYears(now, 1);

  const lastMonthFrom = startOfMonth(lastMonthDate);
  const lastMonthTo = endOfMonth(lastMonthDate);

  const last2From = startOfMonth(twoMonthsAgoDate);
  const last2To = endOfMonth(twoMonthsAgoDate);

  const thisYearFrom = startOfYear(now);
  const thisYearTo = endOfYear(now);

  const lastYearFrom = startOfYear(lastYearDate);
  const lastYearTo = endOfYear(lastYearDate);

  const options: TimeframeOption[] = [
    {
      value: "lastMonth",
      label: format(lastMonthDate, "MMMM yyyy"),
      from: formatDate(lastMonthFrom),
      to: formatDate(lastMonthTo),
    },
    {
      value: "last2Months",
      label: `${format(twoMonthsAgoDate, "MMMM yyyy")}`,
      from: formatDate(last2From),
      to: formatDate(last2To),
    },
    {
      value: "thisYear",
      label: format(now, "yyyy"),
      from: formatDate(thisYearFrom),
      to: formatDate(thisYearTo),
    },
    {
      value: "lastYear",
      label: format(lastYearDate, "yyyy"),
      from: formatDate(lastYearFrom),
      to: formatDate(lastYearTo),
    },
    {
      value: "allTime",
      label: "All Time",
    },
    {
      value: "custom",
      label: "Custom",
    },
  ];

  _cache = { key: cacheKey, options };
  return options;
}

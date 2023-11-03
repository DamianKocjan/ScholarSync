import { useCallback, useMemo } from "react";

const DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

export function useFormatRelativeDate(locale = "en-us") {
  const formatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat(locale, {
        numeric: "auto",
      }),
    [locale],
  );

  const formatRelativeDate = useCallback(
    (toDate: Date, fromDate = new Date()) => {
      let duration =
        ((toDate as unknown as number) - (fromDate as unknown as number)) /
        1000;

      for (let i = 0; i <= DIVISIONS.length; i++) {
        const division = DIVISIONS[i];

        if (!division) {
          continue;
        }

        if (Math.abs(duration) < division.amount) {
          return formatter.format(
            Math.round(duration),
            division.name as Intl.RelativeTimeFormatUnit,
          );
        }
        duration /= division.amount;
      }
      return "";
    },
    [formatter],
  );

  return formatRelativeDate;
}

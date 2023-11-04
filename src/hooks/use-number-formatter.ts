import { useMemo } from "react";

export function useNumberFormatter(locale = "en-us") {
  const formatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

  return formatter;
}

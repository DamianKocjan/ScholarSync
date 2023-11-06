import { useMemo } from "react";

export function useCurrencyFormatter(currency = "USD", locale = "en-us") {
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        currency,
        style: "currency",
      }),
    [currency, locale],
  );

  return formatter;
}

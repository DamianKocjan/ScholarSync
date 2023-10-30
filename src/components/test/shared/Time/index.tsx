import React, { useMemo } from "react";
import { useFormatRelativeDate } from "../../../hooks/formatters/useFormatRelativeDate";

interface TimeProps {
  date: Date;
  children?: React.ReactNode;
}

// TODO: optimize this component
export const Time: React.FC<TimeProps> = ({ date, children }) => {
  const dateFormatter = useFormatRelativeDate();
  const formatedDate = useMemo(
    () => dateFormatter(date),
    [date, dateFormatter]
  );
  const localeStringDate = useMemo(() => date.toLocaleString(), [date]);

  if (children) {
    return (
      <time dateTime={localeStringDate} title={localeStringDate}>
        {children}
      </time>
    );
  }
  return (
    <time title={localeStringDate} dateTime={localeStringDate}>
      {formatedDate}
    </time>
  );
};

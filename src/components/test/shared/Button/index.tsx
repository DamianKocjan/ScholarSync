import { cx } from "class-variance-authority";
import React, { ComponentProps } from "react";

export const Button: React.FC<ComponentProps<"button">> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={cx(
        "rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
};

import { cx } from "class-variance-authority";
import React, { ComponentProps } from "react";

export const Input: React.FC<ComponentProps<"input">> = ({
  className,
  ...props
}) => (
  <input
    className={cx(
      "block w-full border-0 border-b-2 border-transparent p-0 pb-2 outline-none focus:border-indigo-600 focus:outline-none focus:ring-0 sm:text-sm",
      className
    )}
    {...props}
  />
);

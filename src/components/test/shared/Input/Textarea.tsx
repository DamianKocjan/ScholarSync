import { cx } from "class-variance-authority";
import React, { ComponentProps } from "react";

export const Textarea: React.FC<ComponentProps<"textarea">> = ({
  className,
  ...props
}) => (
  <textarea
    rows={3}
    className={cx(
      "block w-full resize-none border-0 border-b-2 border-transparent p-0 pb-2 focus:border-indigo-600 focus:ring-0 sm:text-sm",
      className
    )}
    {...props}
  />
);

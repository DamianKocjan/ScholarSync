import React from "react";

import { cn } from "~/lib/utils";

const H1 = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h1">>(
  function H1({ className, ...props }, ref) {
    return (
      <h1
        ref={ref}
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
          className,
        )}
        {...props}
      />
    );
  },
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h2">>(
  function H2({ className, ...props }, ref) {
    return (
      <h2
        ref={ref}
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
          className,
        )}
        {...props}
      />
    );
  },
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h3">>(
  function H3({ className, ...props }, ref) {
    return (
      <h3
        ref={ref}
        className={cn(
          "scroll-m-20 text-2xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h4">>(
  function H4({ className, ...props }, ref) {
    return (
      <h4
        ref={ref}
        className={cn(
          "scroll-m-20 text-xl font-semibold tracking-tight",
          className,
        )}
        {...props}
      />
    );
  },
);
H4.displayName = "H4";

const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(function Paragraph({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  );
});
Paragraph.displayName = "P";

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.ComponentProps<"blockquote">
>(function Blockquote({ className, ...props }, ref) {
  return (
    <blockquote
      ref={ref}
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
});
Blockquote.displayName = "Blockquote";

const UnorderedList = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(function UnorderedList({ className, ...props }, ref) {
  return (
    <ul
      ref={ref}
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  );
});
UnorderedList.displayName = "UnorderedList";

const OrderedList = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<"ol">
>(function OrderedList({ className, ...props }, ref) {
  return (
    <ol
      ref={ref}
      className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)}
      {...props}
    />
  );
});
OrderedList.displayName = "OrderedList";

const InlineCode = React.forwardRef<HTMLElement, React.ComponentProps<"code">>(
  function InlineCode({ className, ...props }, ref) {
    return (
      <code
        ref={ref}
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className,
        )}
        {...props}
      />
    );
  },
);
InlineCode.displayName = "InlineCode";

const Lead = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  function Lead({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("text-xl text-muted-foreground", className)}
        {...props}
      />
    );
  },
);
Lead.displayName = "Lead";

const LargeText = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  function LargeText({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
      />
    );
  },
);
LargeText.displayName = "LargeText";

const SmallText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(function SmallText({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  );
});
SmallText.displayName = "SmallText";

const MutedText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(function MutedText({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
MutedText.displayName = "MutedText";

export {
  Blockquote,
  H1,
  H2,
  H3,
  H4,
  InlineCode,
  LargeText,
  Lead,
  MutedText,
  OrderedList,
  Paragraph,
  SmallText,
  UnorderedList,
};

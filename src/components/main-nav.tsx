import Link from "next/link";

import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/spotted"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Spotted
      </Link>
      <Link
        href="/notes"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Notes
      </Link>
      <Link
        href="/radio"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        School Radio
      </Link>
    </nav>
  );
}

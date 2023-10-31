import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();

  const isActive = (pathname: string) => {
    if (router.pathname.startsWith(pathname)) {
      return true;
    } else if (pathname.startsWith("/auth") && pathname === "/") {
      return true;
    }
    return false;
  };

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/") ? "" : "text-muted-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/spotted"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/spotted") ? "" : "text-muted-foreground",
        )}
      >
        Spotted
      </Link>
      <Link
        href="/notes"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/notes") ? "" : "text-muted-foreground",
        )}
      >
        Notes
      </Link>
      <Link
        href="/radio"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/radio") ? "" : "text-muted-foreground",
        )}
      >
        School Radio
      </Link>
    </nav>
  );
}

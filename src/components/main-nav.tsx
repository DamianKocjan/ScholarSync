import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";

import { cn } from "~/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();
  const { theme, systemTheme } = useTheme();

  const isActive = (pathname: string) => {
    if (pathname === "/") {
      return router.pathname === pathname;
    }
    return router.pathname.startsWith(pathname);
  };

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link className="mr-4 flex items-center space-x-2 sm:mr-6" href="/">
        <img
          src={
            theme === "dark" || systemTheme === "dark"
              ? "/logo-dark.png"
              : "/logo-light.png"
          }
          alt="ScholarSync logo"
          className="h-10 w-10"
        />
        <span className="hidden font-bold sm:inline-block">Scholar Sync</span>
      </Link>

      <Link
        href="/"
        className={cn(
          "hidden text-sm font-medium transition-colors hover:text-primary sm:block",
          isActive("/") ? "" : "text-muted-foreground",
        )}
      >
        Home
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
        href="/marketplace"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/marketplace") ? "" : "text-muted-foreground",
        )}
      >
        Marketplace
      </Link>
      <Link
        href="/events"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/events") ? "" : "text-muted-foreground",
        )}
      >
        Events
      </Link>
      <Link
        href="/radio"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive("/radio") ? "" : "text-muted-foreground",
        )}
      >
        <span className="hidden sm:block">School Radio</span>
        <span className="sm:hidden">Radio</span>
      </Link>
    </nav>
  );
}

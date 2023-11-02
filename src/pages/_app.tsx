import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Inter as FontSans } from "next/font/google";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { MainNav } from "~/components/main-nav";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";
import { UserNav } from "~/components/user-nav";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";

import "~/styles/globals.css";

export const fontSans = FontSans({
  subsets: ["latin-ext"],
  variable: "--font-sans",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable,
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider session={session}>
          <DndProvider backend={HTML5Backend}>
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-8 pt-6">
              <Component {...pageProps} />
            </div>

            <Toaster />
          </DndProvider>
        </SessionProvider>
      </ThemeProvider>
    </div>
  );
};

export default api.withTRPC(MyApp);

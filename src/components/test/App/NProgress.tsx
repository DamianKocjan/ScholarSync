import { useRouter } from "next/router";
import nprogress from "nprogress";
import { useEffect } from "react";

// This component provides a minimal progress indicator at the header of the page
// when navigating between pages.
export const NProgress = () => {
  const router = useRouter();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const start = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => nprogress.start(), 100);
    };

    const done = () => {
      clearTimeout(timeout);
      nprogress.done();
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);

    return () => {
      done();
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
    };
  }, [router.events]);

  return null;
};

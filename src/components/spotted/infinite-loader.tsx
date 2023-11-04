import { Loader2 } from "lucide-react";

import { useInfinityLoader } from "~/hooks/use-infinity-loader";

interface InfiniteLoaderProps {
  callback: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}

export function InfiniteLoader({
  callback,
  isFetching,
  hasNextPage,
}: InfiniteLoaderProps) {
  const ref = useInfinityLoader({
    callback,
    hasNextPage,
    isFetching,
  });

  return (
    <div ref={ref} className="flex w-full items-center justify-center">
      {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
    </div>
  );
}

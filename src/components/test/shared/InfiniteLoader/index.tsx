import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { useInfinityLoader } from "./useInfinityLoader";

interface InfiniteLoaderProps {
  callback: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
}

export const InfiniteLoader: React.FC<InfiniteLoaderProps> = ({
  callback,
  isFetching,
  hasNextPage,
}) => {
  const ref = useInfinityLoader({
    callback,
    hasNextPage,
    isFetching,
  });

  return (
    <div ref={ref} className="flex w-full items-center justify-center">
      {isFetching && <LoadingSpinner />}
    </div>
  );
};

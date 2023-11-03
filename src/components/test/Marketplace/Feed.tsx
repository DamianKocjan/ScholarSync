import React, { useEffect } from "react";
import { useFeedLimit } from "../../hooks/useFeedLimit";
import { trpc } from "../../utils/trpc";
import { ActivityOfert } from "../shared/Activity/Ofert";
import { EmptyState } from "../shared/EmptyState";
import { ErrorAlert } from "../shared/ErrorAlert";
import { InfiniteLoader } from "../shared/InfiniteLoader";
import { LoadingSpinner } from "../shared/LoadingSpinner";

interface FeedProps {
  exclude?: string;
  filters?: {
    title?: string;
    condition?: "NEW" | "USED" | "UNKNOWN";
    minPrice?: number;
    maxPrice?: number;
    category?: string;
  };
}

export const Feed: React.FC<FeedProps> = ({ filters }) => {
  const limit = useFeedLimit();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = trpc.ofert.getAll.useInfiniteQuery(
    {
      limit,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filters,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    refetch();
  }, [filters, refetch]);

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <ErrorAlert
          title="Something went wrong!"
          message={error?.message ?? String(error)}
        />
      ) : data?.pages?.[0]?.items.length === 0 ? (
        <EmptyState
          title="No oferts yet"
          description="Seems like there are no oferts yet."
        />
      ) : (
        <>
          {data !== undefined &&
            data.pages.map((page) =>
              page.items.map((item) => (
                // TODO: type this
                <ActivityOfert key={item.id} {...(item as any)} />
              ))
            )}
          <InfiniteLoader
            callback={() => fetchNextPage()}
            isFetching={isFetching}
            hasNextPage={hasNextPage ?? false}
          />
        </>
      )}
    </div>
  );
};

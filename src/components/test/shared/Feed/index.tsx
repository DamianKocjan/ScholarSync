import dynamic from "next/dynamic";
import React from "react";
import { useFeedLimit } from "../../../hooks/useFeedLimit";
import { trpc } from "../../../utils/trpc";
import { Activity, ActivityProps, ActivityType } from "../Activity";
import { EmptyState } from "../EmptyState";
import { ErrorAlert } from "../ErrorAlert";
import { InfiniteLoader } from "../InfiniteLoader";
import { LoadingSpinner } from "../LoadingSpinner";

const DynamicCreateActivity = dynamic(
  () => import("../Activity/Create").then((mod) => mod.CreateActivity),
  {
    ssr: false,
  }
);

interface FeedProps {
  withCreate?: boolean;
  exclude?: string;
  type?: "post" | "ofert" | "event" | "poll";
}

export const Feed: React.FC<FeedProps> = ({ exclude, type, withCreate }) => {
  const limit = useFeedLimit();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
  } = trpc.feed.getAll.useInfiniteQuery(
    {
      limit,
      exclude,
      type,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {withCreate && <DynamicCreateActivity />}

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
          title="No posts yet"
          description="Seems like there are no posts yet."
        />
      ) : (
        <>
          {data !== undefined &&
            data.pages.map((page) =>
              page.items.map((item) => (
                <Activity
                  key={item.id}
                  {...(item as ActivityProps)}
                  type={item.type as ActivityType}
                />
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

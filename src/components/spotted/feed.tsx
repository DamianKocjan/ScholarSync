import { AlertCircle, Info } from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

import { api } from "~/utils/api";
import { Loader } from "../loader";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Activity, type ActivityProps, type ActivityType } from "./activity";
import { InfiniteLoader } from "./infinite-loader";

const DynamicCreateActivity = dynamic(
  () => import("./create-activity").then((mod) => mod.CreateActivity),
  {
    ssr: false,
  },
);

interface FeedProps {
  withCreate?: boolean;
  exclude?: string;
  type?: ActivityType;
}

export const Feed: React.FC<FeedProps> = ({ exclude, type, withCreate }) => {
  const limit = 14;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetching,
  } = api.feed.getAll.useInfiniteQuery(
    {
      limit,
      exclude,
      type,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col space-y-6">
      {withCreate && <DynamicCreateActivity />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : data?.pages?.[0]?.items.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No posts yet</AlertTitle>
          <AlertDescription>
            Seems like there are no posts yet.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {data?.pages.map((page) =>
            page.items.map((item) => (
              // @ts-expect-error this is fine
              <Activity
                key={item.id}
                {...(item as ActivityProps)}
                type={item.type as ActivityType}
              />
            )),
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

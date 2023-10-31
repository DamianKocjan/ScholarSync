
import dynamic from "next/dynamic";
import React from "react";
import { api } from "~/utils/api";
// import { EmptyState } from "../EmptyState";
// import { ErrorAlert } from "../ErrorAlert";
// import { InfiniteLoader } from "../InfiniteLoader";
// import { LoadingSpinner } from "../LoadingSpinner";
import { ActivityPost } from "./activity-post";
import { EventPost } from "./event-post";
import { PollPost } from "./poll-post";
//TO DO offert
// const DynamicCreateActivity = dynamic(
//   () => import("../Activity/Create").then((mod) => mod.CreateActivity),
//   {
//     ssr: false,
//   }
// );

const ACTIVITY = {post:ActivityPost, event:EventPost, poll:PollPost}
interface FeedProps {
    withCreate?: boolean;
    exclude?: string;
    type?: "post" | "ofert" | "event" | "poll";
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
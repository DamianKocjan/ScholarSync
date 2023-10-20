import React, { useCallback } from "react";
import { useCommentLimit } from "../../../../hooks/useCommentLimit";
import { trpc } from "../../../../utils/trpc";
import { Button } from "../../Button";
import { ErrorAlert } from "../../ErrorAlert";
import { LoadingSpinner } from "../../LoadingSpinner";
import { Comment } from "./Comment";
import { CommentInput } from "./Input";

interface CommentsProps {
  model: "post" | "ofert" | "event" | "poll";
  modelId: string;
}

export const CommentSection: React.FC<CommentsProps> = ({ model, modelId }) => {
  const limit = useCommentLimit();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = trpc.comment.getAll.useInfiniteQuery(
    {
      model,
      modelId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );

  const refetchComments = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <div className="px-4 py-4 sm:px-6">
      <CommentInput model={model} modelId={modelId} refetch={refetchComments} />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <ErrorAlert
          title="Something went wrong!"
          message={error?.message ?? String(error)}
        />
      ) : data?.pages?.[0]?.items.length !== 0 ? (
        <div className="flex flex-col gap-4">
          {data?.pages.map((page) =>
            page.items.map((item) => <Comment key={item.id} {...item} />)
          )}

          {hasNextPage && !isFetchingNextPage && (
            <Button onClick={async () => await fetchNextPage()}>
              Load more
            </Button>
          )}

          {isFetchingNextPage && (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

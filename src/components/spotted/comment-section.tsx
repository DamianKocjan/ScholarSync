import { AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { MutedText, Paragraph, SmallText } from "~/components/ui/typography";
import { useForm } from "~/hooks/use-form";
import { useFormatRelativeDate } from "~/hooks/use-format-relative-date";
import { api } from "~/utils/api";
import { Loader } from "../loader";
import { type ActivityType } from "./activity";

interface CommentsProps {
  model: ActivityType;
  modelId: string;
}

export const CommentSection: React.FC<CommentsProps> = ({ model, modelId }) => {
  const limit = 10;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isLoading,
    isFetchingNextPage,
    refetch,
  } = api.comment.getAll.useInfiniteQuery(
    {
      model,
      modelId,
      limit,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    },
  );

  const refetchComments = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 px-4 py-4 sm:px-6">
      <CommentInput model={model} modelId={modelId} refetch={refetchComments} />
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : data?.pages?.[0]?.items.length !== 0 ? (
        <div className="flex flex-col gap-4">
          {data?.pages.map((page) =>
            page.items.map((item) => <Comment key={item.id} {...item} />),
          )}

          {hasNextPage && !isFetchingNextPage && (
            <Button onClick={async () => await fetchNextPage()}>
              Load more
            </Button>
          )}

          {isFetchingNextPage && <Loader />}
        </div>
      ) : null}
    </div>
  );
};

const DynamicInteractions = dynamic(
  () => import("./interactions").then((mod) => mod.Interactions),
  {
    ssr: false,
  },
);

interface CommentProps {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string | null; image: string | null };
}
function Comment({ id, content, createdAt, user }: CommentProps) {
  const dateFormatter = useFormatRelativeDate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.image ?? ""} alt={user.name ?? "??"} />
          <AvatarFallback>
            {user.name
              ? user.name?.charAt(0).toUpperCase() +
                user.name?.charAt(1).toUpperCase()
              : "??"}
          </AvatarFallback>
        </Avatar>
        <SmallText className="flex-1">{user.name}</SmallText>
        <MutedText>{dateFormatter(createdAt)}</MutedText>
      </CardHeader>
      <CardContent className="space-y-6">
        <Paragraph>{content}</Paragraph>

        <DynamicInteractions model="COMMENT" modelId={id} />
      </CardContent>
    </Card>
  );
}

const commentSchema = z.object({
  content: z.string().min(1),
});

interface CommentInputProps {
  model: ActivityType;
  modelId: string;
  refetch: () => Promise<void>;
}

function CommentInput({ model, modelId, refetch }: CommentInputProps) {
  const { data: sessionData } = useSession();
  const form = useForm({
    schema: commentSchema,
  });
  const mutation = api.comment.create.useMutation({
    async onSuccess() {
      form.setValue("content", "");
      await refetch();
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const parsedContent = data.content.trim();
    if (!parsedContent) return;

    await mutation.mutateAsync({
      content: parsedContent,
      model,
      modelId,
    });
  });

  return (
    <div className="flex space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={sessionData?.user.image ?? undefined}
          alt={sessionData?.user.name ?? undefined}
        />
        <AvatarFallback>
          {sessionData?.user.name
            ? sessionData.user.name?.charAt(0).toUpperCase() +
              sessionData.user.name?.charAt(1).toUpperCase()
            : "??"}
        </AvatarFallback>
      </Avatar>

      <Form {...form}>
        <form className="w-full space-y-2" onSubmit={handleSubmit}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add your comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add your comment..."
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="float-right" type="submit" variant="outline">
            Comment
          </Button>
        </form>
      </Form>
    </div>
  );
}

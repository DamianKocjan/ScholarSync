import { Check, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Paragraph, SmallText } from "~/components/ui/typography";
import { api } from "~/utils/api";

const DynamicCommentSection = dynamic(
  () => import("./comment-section").then((mod) => mod.CommentSection),
  {
    ssr: false,
  },
);
const DynamicInteractions = dynamic(
  () => import("./interactions").then((mod) => mod.Interactions),
  {
    ssr: false,
  },
);

export interface ActivityPollProps {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string | null; image: string | null };
  _count: {
    comments: number;
    votes: number;
  };
}

export function ActivityPoll({
  id,
  user,
  createdAt,
  title,
  description,
  _count,
}: ActivityPollProps) {
  const [openCommentSection, setOpenCommentSection] = useState(false);

  const {
    data: pollOptions,
    isLoading: pollOptionsLoading,
    isError: pollOptionsError,
    error: pollOptionsErrorData,
    refetch,
  } = api.poll.options.useQuery(
    {
      pollId: id,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const totalVotes = useMemo(
    () =>
      pollOptions?.result.reduce(
        (acc, option) => acc + option._count.votes,
        0,
      ) ?? 0,
    [pollOptions],
  );

  const { mutateAsync: vote, isLoading } = api.poll.vote.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  return (
    <Card className="mb-5 flex h-fit w-fit min-w-[40rem] max-w-sm flex-col bg-slate-100 p-2">
      <CardHeader>
        <div className="flex-column flex items-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? "??"} />
            <AvatarFallback>
              {user.name
                ? user.name?.charAt(0).toUpperCase() +
                  user.name?.charAt(1).toUpperCase()
                : "??"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <Paragraph>{user.name}</Paragraph>
            <SmallText>{createdAt.toLocaleDateString()}</SmallText>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="break-all">{title}</CardTitle>

        <Paragraph className="mt-2">{description}</Paragraph>

        <div className="mt-2 space-y-4">
          {pollOptionsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="mt-4 flex" />
            ))
          ) : pollOptionsError ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {pollOptionsErrorData?.message ?? "Something went wrong"}
              </AlertDescription>
            </Alert>
          ) : (
            pollOptions?.result.map((option) => (
              <Button
                key={option.id}
                className="w-full"
                disabled={isLoading}
                onClick={async () =>
                  await vote({
                    optionId: option.id,
                    pollId: id,
                  })
                }
              >
                {option.votes.length > 0 ? (
                  <Check className="mr-2 h-5 w-5 text-secondary" />
                ) : null}
                {option.title}
                {option.votes.length > 0
                  ? ` (${option.votes.length} votes)`
                  : null}
              </Button>
            ))
          )}
          {totalVotes !== undefined && totalVotes > 0 && (
            <p className="mt-2 text-gray-500">
              {totalVotes} {totalVotes === 0 ? "vote" : "votes"}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="POLL" modelId={id} />

        <Button
          type="button"
          variant="ghost"
          className={openCommentSection ? "" : "text-gray-500"}
          onClick={() => setOpenCommentSection((val) => !val)}
        >
          {_count.comments} Comments
        </Button>
      </CardFooter>
      {openCommentSection ? (
        <DynamicCommentSection model="POLL" modelId={id} />
      ) : null}
    </Card>
  );
}

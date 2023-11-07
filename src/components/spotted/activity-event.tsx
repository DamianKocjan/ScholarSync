import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { MutedText, Paragraph, SmallText } from "~/components/ui/typography";
import { api } from "~/utils/api";
import { RemoveActivity } from "./remove-activity";

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

export interface ActivityEventProps {
  id: string;
  title: string;
  description: string;
  from: Date;
  to: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string | null; image: string | null; id: string };
  _count: {
    comments: number;
  };
  withRemove?: boolean;
}

export function ActivityEvent({
  id,
  user,
  createdAt,
  title,
  from,
  to,
  location,
  description,
  _count,
  withRemove,
}: ActivityEventProps) {
  const [openCommentSection, setOpenCommentSection] = useState(false);

  const { data, refetch } = api.event.isInterestedIn.useQuery(
    { eventId: id },
    {
      refetchOnWindowFocus: false,
    },
  );
  const { mutateAsync: takePartInEvent } = api.event.interestedIn.useMutation({
    async onSuccess() {
      await refetch();
    },
  });

  return (
    <Card className="mb-5 w-full p-2 sm:max-w-xl">
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

          {withRemove ? (
            <RemoveActivity id={id} type="EVENT" userId={user.id} />
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="break-all">
          <Link href={`/spotted/${id}`}>{title}</Link>
        </CardTitle>

        <MutedText className="mt-2">
          {from.toLocaleDateString()} - {to.toLocaleDateString()}: {location}
        </MutedText>

        <Paragraph>{description}</Paragraph>

        {data !== undefined && (
          <Button
            type="button"
            className="mt-2 w-full"
            onClick={async () =>
              await takePartInEvent({
                eventId: id,
              })
            }
            variant={data ? "default" : "outline"}
          >
            {data ? "I'm interest in event!" : "Interested in event?"}
          </Button>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="EVENT" modelId={id} />

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
        <DynamicCommentSection model="EVENT" modelId={id} />
      ) : null}
    </Card>
  );
}

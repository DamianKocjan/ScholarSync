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
import { Paragraph, SmallText } from "~/components/ui/typography";
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

export interface ActivityPostProps {
  type: "POST";
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: { name: string | null; image: string | null; id: string };
  _count: {
    comments: number;
  };
  withRemove?: boolean;
}

export function ActivityPost({
  id,
  user,
  createdAt,
  title,
  content,
  _count,
  withRemove,
}: ActivityPostProps) {
  const [openCommentSection, setOpenCommentSection] = useState(false);

  return (
    <Card className="mb-5 flex h-fit w-fit min-w-[40rem] max-w-sm flex-col p-2">
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
            <RemoveActivity id={id} type="POST" userId={user.id} />
          ) : null}
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="break-all">
          <Link href={`/spotted/${id}`}>{title}</Link>
        </CardTitle>

        <Paragraph className="mt-2">{content}</Paragraph>
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="POST" modelId={id} />

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
        <DynamicCommentSection model="POST" modelId={id} />
      ) : null}
    </Card>
  );
}

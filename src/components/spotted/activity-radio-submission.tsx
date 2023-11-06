import dynamic from "next/dynamic";
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

export interface ActivityRadioSubmissionProps {
  type: "RADIO_SUBMISSION";
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  link: string;
  user: { name: string | null; image: string | null };
  _count: {
    comments: number;
  };
}

export function ActivityRadioSubmission({
  id,
  user,
  createdAt,
  title,
  content,
  link,
  _count,
}: ActivityRadioSubmissionProps) {
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
        </div>
      </CardHeader>

      <CardContent>
        <CardTitle className="break-all">{title}</CardTitle>

        <Paragraph className="mt-2">{content}</Paragraph>

        {link.startsWith("https://www.youtube.com/watch?v=") ? (
          <iframe
            src={link.replace("watch?v=", "embed/")}
            className="mt-2 h-96 w-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : link.startsWith("https://youtu.be/") ? (
          <iframe
            src={link.replace("youtu.be/", "youtube.com/embed/")}
            className="mt-2 h-96 w-full"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : link.startsWith("https://open.spotify.com/track/") ? (
          <iframe
            src={link.replace(
              "https://open.spotify.com/track/",
              "https://open.spotify.com/embed/track/",
            )}
            className="mt-2 h-20 w-full rounded-xl"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        ) : null}
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="RADIO_SUBMISSION" modelId={id} />

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
        <DynamicCommentSection model="RADIO_SUBMISSION" modelId={id} />
      ) : null}
    </Card>
  );
}

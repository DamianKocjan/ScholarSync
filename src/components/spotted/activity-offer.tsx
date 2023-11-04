import dynamic from "next/dynamic";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  H2,
  MutedText,
  Paragraph,
  SmallText,
} from "~/components/ui/typography";
import { cn } from "~/lib/utils";

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

export interface ActivityOfferProps {
  id: string;
  title: string;
  user: { name: string | null; image: string | null };
  description: string;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  condition: "NEW" | "USED" | "UNKNOWN";
  image: string;
  category: string;
  _count: {
    comments: number;
  };
}

export function ActivityOffer({
  id,
  user,
  description,
  createdAt,
  title,
  price,
  condition,
  category,
  image,
  _count,
}: ActivityOfferProps) {
  const [openCommentSection, setOpenCommentSection] = useState(false);

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
        <CardTitle className="text-xl">
          <H2>
            {title} - {price.toString()}
          </H2>
        </CardTitle>
        <MutedText>
          Category: {category} Condition {condition}
        </MutedText>
        <p>{description}</p>
        <img src={image} className="mt-7 max-h-[30rem] min-h-[10rem] w-full" />
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="EVENT" modelId={id} />

        <button
          className={cn(
            "text-sm",
            openCommentSection ? "text-gray-700" : "text-gray-500",
          )}
          onClick={() => setOpenCommentSection((val) => !val)}
        >
          {_count.comments} Comments
        </button>
      </CardFooter>
      {openCommentSection ? (
        <DynamicCommentSection model="EVENT" modelId={id} />
      ) : null}
    </Card>
  );
}

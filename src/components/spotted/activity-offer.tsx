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
import {
  LargeText,
  MutedText,
  Paragraph,
  SmallText,
} from "~/components/ui/typography";
import { useCurrencyFormatter } from "~/hooks/use-currency-formatter";

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
  const formatter = useCurrencyFormatter();

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

        <div className="mt-2 flex items-center justify-between">
          <LargeText>{formatter.format(price)}</LargeText>

          <MutedText>
            {category} - {condition.toLowerCase()}
          </MutedText>
        </div>

        <Paragraph>{description}</Paragraph>

        <img src={image} className="mt-7 max-h-[30rem] min-h-[10rem] w-full" />
      </CardContent>

      <CardFooter className="flex justify-between">
        <DynamicInteractions model="OFFER" modelId={id} />

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
        <DynamicCommentSection model="OFFER" modelId={id} />
      ) : null}
    </Card>
  );
}

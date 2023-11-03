import type { Comment as PComment, User } from "@prisma/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useMemo } from "react";
import { Avatar } from "../../Avatar";
import { Time } from "../../Time";

const DynamicInteractions = dynamic(
  () => import("../Interactions").then((mod) => mod.Interactions),
  {
    ssr: false,
  }
);

interface CommentProps extends PComment {
  user: User;
}

export const Comment: React.FC<CommentProps> = ({
  id,
  content,
  updatedAt,
  createdAt,
  user,
}) => {
  const time = useMemo(
    () => (+updatedAt - +createdAt !== 0 ? updatedAt : createdAt),
    [createdAt, updatedAt]
  );

  return (
    <div className="space-y mt-1 flex items-start space-x-4 first-of-type:mt-4">
      <div className="flex-shrink-0">
        <Avatar src={user.image} alt="User profile" />
      </div>
      <div className="min-w-0 flex-1">
        <div>
          <p className="text-sm text-gray-500">
            <Link href={`/user/${user.id}`}>
              <a className="text-black">{user.name}</a>
            </Link>
            <span> · </span>
            <Time date={time} />
            {+updatedAt - +createdAt !== 0 && " (edited)"}
          </p>
          <p className="mt-0.5 text-sm text-gray-500">{content}</p>
          <DynamicInteractions model="comment" modelId={id} />
        </div>
      </div>
    </div>
  );
};

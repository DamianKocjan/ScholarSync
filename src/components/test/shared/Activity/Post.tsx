import type { Post } from "@prisma/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";
import { ModelData } from "../../../types";
import { classNames } from "../../../utils/classnames";
import { Avatar } from "../Avatar";
import { Time } from "../Time";
import { Activity } from "./Layout";

const DynamicInteractions = dynamic(
  () => import("./Interactions").then((mod) => mod.Interactions),
  {
    ssr: false,
  }
);

const DynamicCommentSection = dynamic(
  () => import("./CommentSection").then((mod) => mod.CommentSection),
  {
    ssr: false,
  }
);

export interface ActivityPostProps extends Post, ModelData {}

export const ActivityPost: React.FC<ActivityPostProps> = ({
  id,
  user,
  createdAt,
  title,
  content,
  _count,
}) => {
  createdAt = new Date(createdAt);
  const [openCommentSection, setOpenCommentSection] = useState(false);

  return (
    <Activity>
      <Activity.Navbar>
        <div className="flex">
          <Avatar src={user.image} alt="avatar" />
          <div className="ml-4 flex flex-col">
            <Link
              href={`/user/${user.id}`}
              className="text-sm font-medium text-gray-900"
            >
              {user.name}
            </Link>
            <p className="text-sm text-gray-500">
              <Time date={createdAt} />
            </p>
          </div>
        </div>
      </Activity.Navbar>
      <Activity.Body>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">
            <Link href={`/activity/${id}`}>{title}</Link>
          </h3>
          <span className="prose-sm text-gray-900">{content}</span>
        </div>
      </Activity.Body>
      <Activity.Footer>
        <div className="flex flex-col">
          <div className="flex">
            <DynamicInteractions modelId={id} model="post" />
            <div className="flex-1" />
            <button
              className={classNames(
                "text-sm",
                openCommentSection ? "text-gray-700" : "text-gray-500"
              )}
              onClick={() => setOpenCommentSection((val) => !val)}
            >
              {_count.comments} Comments
            </button>
          </div>
        </div>
      </Activity.Footer>
      {openCommentSection && (
        <DynamicCommentSection model="post" modelId={id} />
      )}
    </Activity>
  );
};

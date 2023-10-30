import { Ofert } from "@prisma/client";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useCurrencyFormatter } from "../../../hooks/formatters/useCurrencyFormatter";
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

export interface ActivityOfertProps extends Ofert, ModelData {
  image: string;
}

export const ActivityOfert: React.FC<ActivityOfertProps> = ({
  id,
  user,
  createdAt,
  title,
  condition,
  category,
  image,
  price,
  description,
  _count,
}) => {
  createdAt = new Date(createdAt);
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const numberFormatter = useCurrencyFormatter();
  const formatedPrice = useMemo(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    () => numberFormatter.format(price),
    [price, numberFormatter]
  );

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
          <img
            src={image}
            alt={`Image of ofert ${title}`}
            className="my-1 h-64 w-full rounded-md object-cover"
            loading="lazy"
          />
          <div className="-mt-1 flex text-sm text-gray-500">
            <p>
              {category}, condition: {condition.toLowerCase()}
            </p>
            <div className="flex-1" />
          </div>
          <span className="prose-sm text-gray-900">{description}</span>
          <div className="mt-3 flex items-center">
            <p className="text-lg font-semibold text-gray-900">
              <strong>{formatedPrice}</strong>
            </p>
            <div className="flex-1" />
            <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Buy
            </button>
          </div>
        </div>
      </Activity.Body>
      <Activity.Footer>
        <div className="flex flex-col">
          <div className="flex">
            <DynamicInteractions modelId={id} model="ofert" />
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
        <DynamicCommentSection model="ofert" modelId={id} />
      )}
    </Activity>
  );
};

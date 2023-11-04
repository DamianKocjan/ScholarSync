import { type Event, type Offer, type Poll, type Post } from "@prisma/client";
import React from "react";

import { ActivityEvent, type ActivityEventProps } from "./activity-event";
import { ActivityOffer, type ActivityOfferProps } from "./activity-offer";
import { ActivityPoll, type ActivityPollProps } from "./activity-poll";
import { ActivityPost, type ActivityPostProps } from "./activity-post";

type PartialOffer = Partial<Offer>;
type PartialPost = Partial<Post>;
type PartialEvent = Partial<Event>;
type PartialPoll = Partial<Poll>;

export type ActivityType = "OFFER" | "POST" | "EVENT" | "POLL";

export interface ActivityProps
  extends PartialOffer,
    PartialPost,
    PartialEvent,
    PartialPoll {
  id: string;
  type: ActivityType;
}

export const Activity: React.FC<ActivityProps> = ({ type, ...props }) => {
  if (type === "OFFER") {
    return <ActivityOffer {...(props as unknown as ActivityOfferProps)} />;
  } else if (type === "EVENT") {
    return <ActivityEvent {...(props as ActivityEventProps)} />;
  } else if (type === "POLL") {
    return <ActivityPoll {...(props as ActivityPollProps)} />;
  }
  return <ActivityPost {...(props as ActivityPostProps)} />;
};

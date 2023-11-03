import { Event, Ofert, Poll, Post } from "@prisma/client";
import React from "react";
import { ActivityEvent, ActivityEventProps } from "./Event";
import { ActivityOfert, ActivityOfertProps } from "./Ofert";
import { ActivityPoll, ActivityPollProps } from "./Poll";
import { ActivityPost, ActivityPostProps } from "./Post";

type PartialOfert = Partial<Ofert>;
type PartialPost = Partial<Post>;
type PartialEvent = Partial<Event>;
type PartialPoll = Partial<Poll>;

export type ActivityType = "ofert" | "post" | "event" | "poll";

export interface ActivityProps
  extends PartialOfert,
    PartialPost,
    PartialEvent,
    PartialPoll {
  id: string;
  type: ActivityType;
}

export const Activity: React.FC<ActivityProps> = ({ type, ...props }) => {
  if (type === "ofert") {
    return <ActivityOfert {...(props as ActivityOfertProps)} />;
  } else if (type === "event") {
    return <ActivityEvent {...(props as ActivityEventProps)} />;
  } else if (type === "poll") {
    return <ActivityPoll {...(props as ActivityPollProps)} />;
  }
  return <ActivityPost {...(props as ActivityPostProps)} />;
};

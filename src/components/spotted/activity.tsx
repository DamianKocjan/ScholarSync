import React from "react";

import { ActivityEvent, type ActivityEventProps } from "./activity-event";
import { ActivityOffer, type ActivityOfferProps } from "./activity-offer";
import { ActivityPoll, type ActivityPollProps } from "./activity-poll";
import { ActivityPost, type ActivityPostProps } from "./activity-post";
import { ActivityRadioSubmission, ActivityRadioSubmissionProps } from "./activity-radio-submission";

export type ActivityType = "OFFER" | "POST" | "EVENT" | "POLL" | "RADIO_SUBMISSION";

export type ActivityProps = (
  | ActivityEventProps
  | ActivityOfferProps
  | ActivityPollProps
  | ActivityPostProps
  | ActivityRadioSubmissionProps
) & {
  id: string;
  type: ActivityType;
};

export const Activity: React.FC<ActivityProps> = ({ type, ...props }) => {
  if (type === "OFFER") {
    return <ActivityOffer {...(props as unknown as ActivityOfferProps)} />;
  } else if (type === "EVENT") {
    return <ActivityEvent {...(props as ActivityEventProps)} />;
  } else if (type === "POLL") {
    return <ActivityPoll {...(props as ActivityPollProps)} />;
  }
  else if (type === "RADIO_SUBMISSION") {
    return <ActivityRadioSubmission {...(props as ActivityRadioSubmissionProps)} />;
  }
  return <ActivityPost {...(props as ActivityPostProps)} />;
};

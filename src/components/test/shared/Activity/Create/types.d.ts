export interface ActivityCreateData {
  event: {
    title: string;
    description: string;
    from: string;
    to: string;
    location: string;
  };
  ofert: {
    title: string;
    description: string;
    price: number;
    condition: "NEW" | "USED" | "UNKNOWN";
    image?: File;
    category: string;
  };
  poll: {
    title: string;
    description: string;
    options: string[];
  };
  post: {
    title: string;
    content: string;
  };
}

export type ActivityCreateDataKeys =
  | keyof ActivityCreateData["event"]
  | keyof ActivityCreateData["ofert"]
  | keyof ActivityCreateData["poll"]
  | keyof ActivityCreateData["post"];

export type HandleSetEventData = (
  key: keyof ActivityCreateData["event"],
  value: unknown
) => void;

export type HandleSetOfertData = (
  key: keyof ActivityCreateData["ofert"],
  value: unknown
) => void;

export type HandleSetPollData = (
  key: keyof ActivityCreateData["poll"],
  value: unknown
) => void;

export type HandleSetPostData = (
  key: keyof ActivityCreateData["post"],
  value: unknown
) => void;

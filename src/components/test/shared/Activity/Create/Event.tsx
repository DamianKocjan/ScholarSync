import React from "react";
import { Input } from "../../Input/Input";
import { Textarea } from "../../Input/Textarea";
import { ActivityCreateData, HandleSetEventData } from "./types";

interface EventProps {
  data: ActivityCreateData["event"];
  handleSetData: HandleSetEventData;
}

export const Event: React.FC<EventProps> = ({ data, handleSetData }) => {
  return (
    <>
      <div>
        <label htmlFor="title" className="sr-only">
          Title
        </label>
        <Input
          name="title"
          id="title"
          required
          placeholder="Your title..."
          value={data.title}
          onChange={(e) => handleSetData("title", e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description" className="sr-only">
          Your description
        </label>
        <Textarea
          name="description"
          id="description"
          required
          placeholder="Your description..."
          value={data.description}
          onChange={(e) => handleSetData("description", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="from" className="text-sm text-gray-500">
            From
          </label>
          <Input
            name="from"
            id="from"
            required
            type="datetime-local"
            placeholder="From..."
            value={new Date(data.from).toISOString().slice(0, 16)}
            onChange={(e) =>
              handleSetData("from", new Date(e.target.value).toISOString())
            }
          />
        </div>
        <div>
          <label htmlFor="to" className="text-sm text-gray-500">
            To
          </label>
          <Input
            name="to"
            id="to"
            required
            type="datetime-local"
            placeholder="To..."
            value={new Date(data.to).toISOString().slice(0, 16)}
            onChange={(e) =>
              handleSetData("to", new Date(e.target.value).toISOString())
            }
          />
        </div>
      </div>
      <div>
        <label htmlFor="location" className="sr-only">
          Location
        </label>
        <Input
          name="location"
          id="location"
          required
          placeholder="Location..."
          value={data.location}
          onChange={(e) => handleSetData("location", e.target.value)}
        />
      </div>
    </>
  );
};
